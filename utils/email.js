import nodemailer from 'nodemailer';

const sendEmail = async(options) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: 'Abhilash BK <bkabhilash0@gmail.com>',
        to: options.to,
        subject: options.subject,
        text: options.message,
    };

    await transport.sendMail(mailOptions);
};

export default sendEmail;
