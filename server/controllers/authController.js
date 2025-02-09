// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendVerificationEmail = require('../utils/sendVerificationEmail');

const register = async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;
    if (!firstName || !lastName || !username || !email || !password) {
        return res.status(400).json({ msg: 'Tous les champs sont obligatoires.' });
    }

    try {
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ msg: "L'utilisateur existe déjà." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            isVerified: false,
        });

        await user.save();

        // Génération d'un token de vérification (valide 1 jour)
        const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        await sendVerificationEmail(user, verificationToken);

        res.status(201).json({ msg: 'Utilisateur créé. Veuillez vérifier votre email pour activer votre compte.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erreur serveur.' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ msg: 'Tous les champs sont obligatoires.' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Identifiants invalides.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Identifiants invalides.' });
        }

        // Optionnel : vérifier que l'email est validé
        if (!user.isVerified) {
            return res.status(400).json({ msg: 'Veuillez activer votre compte via le lien envoyé par email.' });
        }

        const payload = { user: { id: user._id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erreur serveur.' });
    }
};

const verifyEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ msg: 'Utilisateur non trouvé.' });
        }
        if (user.isVerified) {
            return res.status(400).json({ msg: 'Compte déjà vérifié.' });
        }
        user.isVerified = true;
        await user.save();
        res.status(200).json({ msg: 'Compte vérifié avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Token invalide ou expiré.' });
    }
};

module.exports = { register, login, verifyEmail };
