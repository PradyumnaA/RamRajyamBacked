const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to send reset email
const sendResetEmail = async (email, resetToken) => {
    const resetLink = `http://localhost:5000/reset-password?token=${resetToken}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        text: `Click the following link to reset your password: ${resetLink}`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending reset email:', error);
        throw error; // Re-throw the error to be handled in the API
    }
};
