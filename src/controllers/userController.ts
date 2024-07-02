import { NextFunction, Request, Response } from "express";
import UserUsecase from "../usecase/userUsecase";

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
      return res.status(verified.status).json(verified.data?.message);
    } catch (error) {}
  }
}

export default userController;
