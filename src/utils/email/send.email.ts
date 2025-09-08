import { createTransport, type Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const sendEmail = async (data: Mail.Options): Promise<void> => {
  const transporter: Transporter<
    SMTPTransport.SentMessageInfo | SMTPTransport.Options
  > = createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL as string,
      pass: process.env.EMAIL_PASSWORD as string,
    },
  });

  const info = await transporter.sendMail({
    from: `${process.env.APPLICATION_NAME} 🚀" <${
      process.env.EMAIL as string
    }>`,
    ...data,
  });

  console.log("Message sent:", info.messageId);
};
