const nodemailer = require("nodemailer");

const mailSender = async (email, title, body, attachments = []) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"e-pasal" <${process.env.MAIL_USER}>`,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        };

        if (Array.isArray(attachments) && attachments.length > 0) {
            mailOptions.attachments = attachments;
        }

        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info?.messageId || info);
        return info;

    } catch (error) {
        console.error("Error while sending mail in mailSender:", error);
        throw error;
    }
};

module.exports = mailSender;
