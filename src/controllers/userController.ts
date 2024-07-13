import { NextFunction, Request, Response } from "express";
import UserUsecase from "../usecase/userUsecase";
import dotenv from "dotenv";
dotenv.config();

class UserController {
  private _userUsecase: UserUsecase;

  constructor(userUsecase: UserUsecase) {
    this._userUsecase = userUsecase;
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const verifyUser = await this._userUsecase.checkExist(req.body.email);

      if (verifyUser.status === 200) {
        const user = await this._userUsecase.signup(
          req.body.email,
          req.body.userName,
          req.body.displayName,
          req.body.password
        );
        return res.status(user.status).json(user.message);
      } else {
        return res.status(verifyUser.status).json(verifyUser.message);
      }
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp, email } = req.body;
      let verified = await this._userUsecase.verifyOtp(email, otp);
      console.log(verified);


      if (verified.status === 200 && verified.data?.token) {
        console.log("here");

        res.cookie("jwt", verified.data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: "strict",
        });
        return res.status(verified.status).json(verified.data);
      }
      return res.status(verified.status).json(verified.message);
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const otpSend = await this._userUsecase.resendOtp(req.body.email);

      if (otpSend.status === 200) {
        return res.status(otpSend.status).json(otpSend.data);
      }
      console.log(otpSend);

      return res.status(otpSend.status).json(otpSend.message);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const loginVerified = await this._userUsecase.verifyUser(email, password);

      if (loginVerified.status === 200 && loginVerified.data) {
        res.cookie("jwt", loginVerified.data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: "strict",
        });

        return res.status(loginVerified.status).json(loginVerified.data);
      }

      return res.status(loginVerified.status).json(loginVerified.message || { message: "Login failed" });
    } catch (error) {
      next(error);
    }
  }


  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        expires: new Date(0),
        sameSite: "strict",
      });

      return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const otpSent = await this._userUsecase.resendOtp(email);
      if (otpSent.status === 200 && otpSent.data) {
        return res.status(otpSent.status).json(otpSent.data);
      }
      return res.status(otpSent.status).json(otpSent.message || { message: "OTP resend failed" });
    } catch (error) {
      next(error);
    }
  }


  async forgotVerify(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp, email } = req.body;

      if (!otp || !email) {
        return res.status(400).json({ message: "OTP and email are required" });
      }
      const isVerified = await this._userUsecase.verifyForgot(email, otp);

      return res.status(isVerified.status).json(isVerified.data);

    } catch (error) {
      next(error);
    }
  }

}

export default UserController;
