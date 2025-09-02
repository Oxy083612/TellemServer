const nodemailer = require('nodemailer');
async function main(){
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });
    let info = await transporter.sendMail({
        from: '"Test" <test@example.com>',
        to: "someone@example.com",
        subject: "Hello from Ethereal",
        text: "Activate your account now!",
        html: "<b>This is a test email!</b>"
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
main()