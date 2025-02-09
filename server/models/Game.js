// models/Game.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const gameSchema = new mongoose.Schema(
    {
        uuid: {
            type: String,
            default: uuidv4,
            unique: true,
        },
        players: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        board: {
            type: [[String]],
            default: [
                ['', '', ''],
                ['', '', ''],
                ['', '', ''],
            ],
        },
        currentTurn: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        winner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        status: {
            type: String,
            enum: ['waiting', 'in-progress', 'finished'],
            default: 'waiting',
        },
        moves: [
            {
                player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                position: { type: [Number], required: true }, // [row, col]
                symbol: { type: String, enum: ['X', 'O'] },
                timestamp: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Game', gameSchema);
