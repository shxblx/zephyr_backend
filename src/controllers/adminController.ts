import { Request, Response, NextFunction } from "express";
import AdminUsecase from "../usecase/adminUsecase";

class AdminController {
  private adminUsecase: AdminUsecase;

  constructor(adminUsecase: AdminUsecase) {
    this.adminUsecase = adminUsecase;
  }

  async adminLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const isAdmin = await this.adminUsecase.verifyAdmin(
        req.body.email,
        req.body.password
      );

      if (isAdmin.isAdmin === true) {
        res.cookie("adminJwt", isAdmin.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: "strict",
        });
        return res.status(isAdmin.status).json(isAdmin.isAdmin);
      }
      if (isAdmin.data?.passwordMatch === false) {
        return res.status(isAdmin.status).json(isAdmin.data);
      }
      return res.status(isAdmin.status).json(isAdmin.data);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = await this.adminUsecase.getUserData();

      if (userData?.status === 200) {
        return res.status(userData.status).json(userData);
      } else {
        return res.status(userData.status).json(userData.message);
      }
    } catch (error) {
      next(error);
    }
  }
}

export default AdminController;
