// middlewares/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Récupère le token dans le header Authorization
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Accès refusé, token manquant.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Vérifie et décode le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attache l'utilisateur décodé à la requête
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token invalide.' });
    }
};
