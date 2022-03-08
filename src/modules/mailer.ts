import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import Handlebars from "handlebars";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transport = nodemailer.createTransport({
  service: process.env.MAIL_HOST ? undefined : "Mailgun",
  host: process.env.MAILGUN_SMTP_SERVER ? process.env.MAILGUN_SMTP_SERVER : undefined,
  port: process.env.MAILGUN_SMTP_PORT ? Number(process.env.MAILGUN_SMTP_PORT) : undefined,
  auth: {
    user: process.env.MAILGUN_SMTP_LOGIN,
    pass: process.env.MAILGUN_SMTP_PASSWORD,
  },
});

async function sendMail(
  email: string,
  replacements: { [key: string]: any },
  pathToHtml: string,
  header: { subject: string; text: string }
): Promise<SMTPTransport.SentMessageInfo | undefined> {
  const filePath = path.join(__dirname, "../resources/mail", pathToHtml + ".html");
  const source = fs.readFileSync(filePath, "utf-8").toString();
  const template = Handlebars.compile(source);

  const extendedReplacements = { ...replacements, pageUrl: process.env.CLIENT_URL };

  try {
    const message = await transport.sendMail({
      to: email,
      from: process.env.EMAIL,
      subject: header.subject,
      text: header.text,
      html: template(extendedReplacements),
    });
    return message;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export { sendMail };
