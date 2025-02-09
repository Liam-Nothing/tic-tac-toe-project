// controllers/gameController.js
const Game = require('../models/Game');

// Endpoint pour créer une partie
const createGame = async (req, res) => {
    try {
        // On suppose que l'utilisateur est authentifié et que son ID est disponible via req.user.id
        const userId = req.user.id;

        // Création d'une nouvelle partie :
        // Le schéma Game génère automatiquement un UUID unique pour le champ "uuid".
        const newGame = new Game({
            players: [userId], // L'utilisateur qui crée la partie devient le premier joueur
            currentTurn: userId, // Le tour de jeu démarre avec lui
            status: 'waiting', // La partie est en attente d'un deuxième joueur
        });

        await newGame.save();

        res.status(201).json({ game: newGame });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erreur serveur lors de la création de la partie.' });
    }
};

// Endpoint pour rejoindre une partie
const joinGame = async (req, res) => {
    try {
        // On suppose que l'utilisateur est authentifié et que son ID est disponible via req.user.id
        const userId = req.user.id;
        const { uuid } = req.body; // L'UUID de la partie à rejoindre doit être envoyé dans le body

        // Recherche de la partie correspondante
        const game = await Game.findOne({ uuid });
        if (!game) {
            return res.status(404).json({ msg: 'Partie inexistante.' });
        }

        // Vérification si la partie est déjà pleine (on limite ici à 2 joueurs)
        if (game.players.length >= 2) {
            return res.status(400).json({ msg: 'Partie pleine.' });
        }

        // Facultatif : vérifier si l'utilisateur a déjà rejoint la partie
        if (game.players.includes(userId)) {
            return res.status(400).json({ msg: 'Vous avez déjà rejoint cette partie.' });
        }

        // Ajout de l'utilisateur à la partie
        game.players.push(userId);
        // Dès qu'un second joueur rejoint, on passe le statut à "in-progress"
        game.status = 'in-progress';
        // Si le tour de jeu n'était pas défini, on le fixe sur le premier joueur (celui qui a créé la partie)
        if (!game.currentTurn) {
            game.currentTurn = game.players[0];
        }

        await game.save();

        res.status(200).json({ game });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erreur serveur lors de la jointure de la partie.' });
    }
};

const getFinishedGames = async (req, res) => {
    try {
        // Récupère les parties dont le statut est "finished"
        const finishedGames = await Game.find({ status: 'finished' }).populate('players', 'username').populate('winner', 'username');

        return res.status(200).json({ finishedGames });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Erreur lors de la récupération des parties terminées.' });
    }
};

// controllers/gameController.js

/**
 * Exemple de fonction à appeler lorsqu'une partie se termine.
 * @param {String} gameId - L'identifiant de la partie à finaliser.
 * @param {String|null} winnerId - L'ID du vainqueur, ou null en cas d'égalité.
 */
const finishGame = async (gameId, winnerId) => {
    try {
        const game = await Game.findById(gameId);
        if (!game) return;

        game.status = 'finished';
        game.winner = winnerId; // Peut être null en cas d'égalité
        await game.save();

        // Récupère la liste des parties terminées mise à jour
        const finishedGames = await Game.find({ status: 'finished' }).populate('players', 'username').populate('winner', 'username');

        // Émettre l'événement via Socket.IO pour mettre à jour le tableau des scores en temps réel
        global.io.emit('scoreboardUpdate', finishedGames);
    } catch (error) {
        console.error('Erreur lors de la finalisation de la partie:', error);
    }
};

module.exports = { createGame, joinGame, getFinishedGames, finishGame };
