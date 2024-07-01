import Nodemailer from "../../usecase/interfaces/Inodemailer";
import nodemailer from "nodemailer";

class sendOtp implements Nodemailer {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "zephyrforgamer@gmail.com",
        pass: process.env.MAILER,
      },
    });
  }

  sendMail(email: string, otp: number): void {
    const mailOptions: nodemailer.SendMailOptions = {
      from: "zephyrforgamer@gmail.com",
      to: email,
      subject: "Zephyr email verification",
      text: `${email},your verification code is:${otp}`,
    };
  }
}

export default sendOtp;
