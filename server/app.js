// app.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
const connectDB = require('./config/db');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Création du serveur HTTP et initialisation de Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: '*' },
});

// Expose Socket.IO globalement pour y accéder depuis d'autres modules si nécessaire
global.io = io;

io.on('connection', (socket) => {
    console.log(`Client connecté : ${socket.id}`);

    /**
     * Arrivée d’un nouveau joueur dans une salle de jeu.
     * L'événement "joinGameRoom" reçoit un objet contenant le gameId et l'userId.
     * Le socket rejoint alors la "room" dédiée à la partie.
     * On notifie les autres joueurs de la salle avec l'événement "playerJoined".
     */
    socket.on('joinGameRoom', ({ gameId, userId }) => {
        socket.join(gameId);
        socket.to(gameId).emit('playerJoined', { userId });
        console.log(`Utilisateur ${userId} a rejoint la partie ${gameId}`);
    });

    /**
     * Démarrage de la partie.
     * On émet un événement "gameStarted" à tous les clients de la salle de jeu.
     */
    socket.on('startGame', (gameId) => {
        io.to(gameId).emit('gameStarted', { message: 'La partie a démarré.' });
        console.log(`La partie ${gameId} a démarré`);
    });

    /**
     * Coup joué (placement d’un X ou d’un O).
     * L'événement "playMove" reçoit le gameId, les coordonnées ou les détails du coup, et l'userId.
     * On notifie les autres joueurs de la salle avec l'événement "movePlayed".
     */
    socket.on('playMove', ({ gameId, move, userId }) => {
        // Vous pouvez intégrer ici la logique de validation du coup, mise à jour du board, etc.
        io.to(gameId).emit('movePlayed', { move, userId });
        console.log(`Utilisateur ${userId} a joué le coup ${JSON.stringify(move)} dans la partie ${gameId}`);
    });

    /**
     * Changement de tour.
     * L'événement "changeTurn" informe les clients du prochain joueur qui doit jouer.
     */
    socket.on('changeTurn', ({ gameId, nextPlayerId }) => {
        io.to(gameId).emit('turnChanged', { nextPlayerId });
        console.log(`C'est au tour de ${nextPlayerId} dans la partie ${gameId}`);
    });

    /**
     * Un joueur quitte la partie.
     * L'événement "playerLeft" notifie les autres clients que le joueur a quitté.
     */
    socket.on('playerLeft', ({ gameId, userId }) => {
        io.to(gameId).emit('playerLeft', { userId });
        console.log(`Utilisateur ${userId} a quitté la partie ${gameId}`);
    });

    /**
     * Un joueur reprend la partie (reconnexion par exemple).
     * L'événement "playerResumed" informe les autres clients de la reprise.
     */
    socket.on('playerResumed', ({ gameId, userId }) => {
        io.to(gameId).emit('playerResumed', { userId });
        console.log(`Utilisateur ${userId} a repris la partie ${gameId}`);
    });

    /**
     * Fin de partie (victoire ou match nul).
     * L'événement "finishGame" reçoit le gameId, l'id du vainqueur (ou null en cas d'égalité)
     * et éventuellement l'état final du plateau.
     * On notifie tous les clients de la salle que la partie est terminée.
     */
    socket.on('finishGame', ({ gameId, winnerId, finalBoard }) => {
        io.to(gameId).emit('gameFinished', { winnerId, finalBoard });
        console.log(`La partie ${gameId} est terminée. Vainqueur : ${winnerId}`);
    });

    socket.on('disconnect', () => {
        console.log(`Client déconnecté : ${socket.id}`);
    });
});

// Intégration des routes existantes (auth, game, etc.)
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
