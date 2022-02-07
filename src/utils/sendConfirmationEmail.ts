import { sendMail } from "../modules/mailer";

export async function sendConfirmationEmail(
  token: string,
  email: string
): Promise<void> {
  await sendMail(email, { email, token }, "auth/confirm_email");
}
