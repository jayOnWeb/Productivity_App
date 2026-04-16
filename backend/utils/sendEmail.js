const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // ✅ Add this — verify connection first
    await transporter.verify((error, success) => {
        if (error) {
            console.log("Transporter error:", error);
        } else {
            console.log("Server is ready to send emails ✅");
        }
    });

    const info = await transporter.sendMail({
        from: `"Your App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
};

module.exports = sendEmail;