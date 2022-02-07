import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import Handlebars from "handlebars";

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
  pathToHtml: string
) {
  const filePath = path.join(
    __dirname,
    "../resources/mail",
    pathToHtml + ".html"
  );
  const source = fs.readFileSync(filePath, "utf-8").toString();
  const template = Handlebars.compile(source);

  transport.sendMail({
    to: email,
    from: process.env.EMAIL,

    subject: "Message title",
    text: "Plaintext version of the message",
    html: template(replacements),
  });
}

export { sendMail };
