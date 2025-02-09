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

// Expose Socket.IO globalement pour y accéder dans les contrôleurs
global.io = io;

io.on('connection', (socket) => {
    console.log('Nouveau client connecté');

    socket.on('disconnect', () => {
        console.log('Client déconnecté');
    });
});

// Intégration des routes d'authentification et de jeu
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
