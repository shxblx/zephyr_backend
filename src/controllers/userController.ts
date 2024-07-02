import { NextFunction, Request, Response } from "express";
import UserUsecase from "../usecase/userUsecase";
import dotenv from "dotenv";
dotenv.config();

class userController {
  private userUsecase: UserUsecase;

  constructor(userUsecase: UserUsecase) {
    this.userUsecase = userUsecase;
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const verifyUser = await this.userUsecase.checkExist(req.body.email);
      console.log(verifyUser);

      if (verifyUser.data.status === true) {
        const user = await this.userUsecase.signup(
          req.body.email,
          req.body.userName,
          req.body.displayName,
          req.body.password
        );
        return res.status(user.status).json(user.data);
      } else {
        return res.status(verifyUser.status).json(verifyUser.data);
      }
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp, email } = req.body;
      let verified = await this.userUsecase.verifyOtp(email, otp);

      if (verified.status === 200 && verified.data?.token) {
        res.cookie("jwt", verified.data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: "strict",
        });
      }
      return res.status(verified.status).json(verified.data);
    } catch (error) {
      next(error);
    }
  }
}

export default userController;
