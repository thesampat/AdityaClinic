const nodemailer = require('nodemailer');

// Create a transporter using your email service credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send an email
const sendEmail = async (to, subject, text) => {

    try {
        if (!to) {
            throw new Error('Recipient email address is required.');
        }
        // Set up email options
        const mailOptions = {
            from: process.env.EMAIL_ACCOUNT,
            to,
            subject,
            text,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.messageId);
    } catch (error) {


        console.error('Error sending email: ', error);
        throw error;
    }
};

module.exports = sendEmail
