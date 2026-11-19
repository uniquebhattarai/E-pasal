import nodemailer from "nodemailer";

export const mailSender = async (
  email: string,
  title: string,
  body: string,
  attachments: any[] = []
): Promise<any> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"e-pasal" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    };

    if (Array.isArray(attachments) && attachments.length > 0) {
      mailOptions.attachments = attachments;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info?.messageId || info);
    return info;
  } catch (error) {
    console.error("Error while sending mail in mailSender:", error);
    throw error;
  }
};

export default mailSender;
