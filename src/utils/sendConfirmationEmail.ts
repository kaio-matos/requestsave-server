import mailer from "../modules/mailer";

export async function sendConfirmationEmail(
  token: string,
  email: string
): Promise<void> {
  await mailer.sendMail({
    to: email,
    from: process.env.EMAIL,
    template: "auth/confirm_email",
    context: { token, email },
  });
}
