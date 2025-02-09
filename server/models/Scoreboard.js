// models/Scoreboard.js
const mongoose = require('mongoose');

const scoreboardSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        draws: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Scoreboard', scoreboardSchema);
