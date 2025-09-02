const nodemailer = require('nodemailer');

async function sendVerificationEmail(toEmail, verificationLink) {
    try {
        const account = await nodemailer.createTestAccount();

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: account.user,
                pass: account.pass,
            },
        });

        const info = await transporter.sendMail({
            from: "Example app <no-reply@example.com",
            to: toEmail,
            subject: "Verification link",
            html: `
                    <p>This message was sent from a Node.js integration test.</p>
                    <p>Click the link to verify your account</p>
                    <a href ="${verificationLink}">Verification Link</a>
                  `,
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
         
        return info;

    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Rzucamy błąd, żeby główna funkcja mogła go obsłużyć
    }
}

module.exports = sendVerificationEmail;