import nodemailer from "nodemailer";
import envConfig from "../configs/envConfig";

export async function sendEmail(
  to: string,
  html: string,
  subject: string = "Reset password link! "
) {
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
    to: to,
    subject: subject,
    html: html,
  });
}
