import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../../config", ".env") });

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: +process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

transport.use(
  "compile",
  hbs({
    viewEngine: {
      defaultLayout: undefined,
      partialsDir: path.resolve("./src/resources/mail/"),
    },
    viewPath: path.resolve("./src/resources/mail/"),
    extName: ".html",
  })
);

export default transport;
