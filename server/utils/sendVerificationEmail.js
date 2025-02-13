// utils/sendVerificationEmail.js
const fs = require('fs');
const path = require('path');
const mjml2html = require('mjml');
const transporter = require('../config/email');

const sendVerificationEmail = async (user, token) => {
    const templatePath = path.join(__dirname, '../templates/verification.mjml');
    let mjmlTemplate = fs.readFileSync(templatePath, 'utf8');

    // Création du lien d'activation (adaptable selon votre frontend)
    const activationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify/?token=${token}`;
    mjmlTemplate = mjmlTemplate.replace('{{activationLink}}', activationLink);

    const htmlOutput = mjml2html(mjmlTemplate);

    const mailOptions = {
        from: process.env.EMAIL_FROM, // ex : "Nom <votre-email@example.com>"
        to: user.email,
        subject: 'Activation de votre compte',
        html: htmlOutput.html,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
