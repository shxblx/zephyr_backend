import Nodemailer from "../../usecase/interfaces/user/Inodemailer";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

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
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center; background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
          <h2 style="color: #FF5F09;">Zephyr Email Verification</h2>
          <p>Hello ${email},</p>
          <p>Your verification code is:</p>
          <div style="display: inline-block; background-color: #FF5F09; color: white; padding: 10px; border-radius: 5px; font-size: 18px; text-align: center;">
            ${otp}
          </div>
          <p style="margin-top: 20px;">Please use this code to complete your verification process.</p>
          <p>Thank you,<br>Zephyr Team</p>
        </div>
      `,
    };

    this.transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Verification code sent successfully");
      }
    });
  }
}

export default sendOtp;
