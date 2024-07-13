import { Request, Response, NextFunction } from "express";
import AdminUsecase from "../usecase/adminUsecase";

class AdminController {
  private _adminUsecase: AdminUsecase;

  constructor(adminUsecase: AdminUsecase) {
    this._adminUsecase = adminUsecase;
  }

  async adminLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const isAdmin = await this._adminUsecase.verifyAdmin(
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
      const userData = await this._adminUsecase.getUserData();

      if (userData?.status === 200) {
        return res.status(userData.status).json(userData);
      } else {
        return res.status(userData.status).json(userData.message);
      }
    } catch (error) {
      next(error);
    }
  }

  async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userBlocked = await this._adminUsecase.blockUser(req.body.userId);
      return res.sendStatus(userBlocked.status);
    } catch (error) {
      console.error("Error in blockUser route:", error);
      return res.sendStatus(500);
    }
  }

  async unBlockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userUnblocked = await this._adminUsecase.unblockUser(req.body.userId)
      return res.sendStatus(userUnblocked.status)
    } catch (error) {
      console.error("Error in Unblock route", error)
      res.sendStatus(500)
    }
  }
}

export default AdminController;
