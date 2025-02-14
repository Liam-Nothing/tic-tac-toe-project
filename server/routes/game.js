// routes/game.js
const express = require('express');
const router = express.Router();
const { createGame, joinGame, getFinishedGames, finishGame, getOngoingGames, getGameDetails } = require('../controllers/gameController');
const auth = require('../middlewares/auth'); // Middleware d'authentification déjà créé

// Route pour créer une partie
router.post('/create', auth, createGame);

// Route pour rejoindre une partie
router.post('/join', auth, joinGame);

// Route pour récupérer l'historique des parties terminées
router.get('/history', auth, getFinishedGames);

// Route pour les parties en cours
router.get('/ongoing', auth, getOngoingGames);

// ... vos autres routes
router.get('/details', auth, getGameDetails);

module.exports = router;
