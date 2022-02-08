import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import Handlebars from "handlebars";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
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

  try {
    const message = await transport.sendMail({
      to: email,
      from: process.env.EMAIL,

      subject: header.subject,
      text: header.text,
      html: template(replacements),
    });
    return message;
  } catch (err) {
    return undefined;
  }
}

export { sendMail };
