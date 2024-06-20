import nodemailer from "nodemailer";
import envConfig from "../configs/envConfig";

export async function sendEmail() {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: envConfig.email,
      pass: envConfig.emailAppPass,
    },
  });

  await transporter.sendMail({
    from: envConfig.email,
    to: "kamrul.learnprogramming@gmail.com",
    subject: "Hello ✔",
    html: "<b>Hello world?</b>",
  });
}
