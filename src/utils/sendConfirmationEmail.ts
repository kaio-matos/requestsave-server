import SMTPTransport from "nodemailer/lib/smtp-transport";
import { sendMail } from "../modules/mailer";

export async function sendConfirmationEmail(
  token: string,
  email: string
): Promise<SMTPTransport.SentMessageInfo | undefined> {
  try {
    const message = await sendMail(email, { email, token }, "auth/confirm_email", {
      subject: "Email de confirmação",
      text: "Caso não tenha sido você que pediu esta confirmação apenas ignore",
    });

    return message;
  } catch (err) {
    return undefined;
  }
}
