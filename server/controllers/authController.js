// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;
    if (!firstName || !lastName || !username || !email || !password) {
        return res.status(400).json({ msg: 'Tous les champs sont obligatoires.' });
    }

    try {
        // Vérifier si l'utilisateur existe déjà (email ou username)
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ msg: "L'utilisateur existe déjà." });
        }

        // Hash du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Création de l'utilisateur
        user = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
        });

        await user.save();

        // (Ici, vous pourrez déclencher l'envoi de l'email de validation avec MJML)

        res.status(201).json({ msg: 'Utilisateur créé avec succès.' });
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
        // Vérifier que l'utilisateur existe
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Identifiants invalides.' });
        }

        // Vérification du mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Identifiants invalides.' });
        }

        // (Optionnel : vérifier que l'email a été validé)

        // Générer le token JWT
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

module.exports = { register, login };
