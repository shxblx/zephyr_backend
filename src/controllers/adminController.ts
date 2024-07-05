import { Request, Response, NextFunction } from "express";
import AdminUsecase from "../usecase/adminUsecase";

class AdminController {
  private adminUsecase: AdminUsecase;

  constructor(adminUsecase: AdminUsecase) {
    this.adminUsecase = adminUsecase;
  }

  async adminLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const isAdmin = await this.adminUsecase.checkAdmin(req.body.email);

      if (isAdmin.isAdmin === true) {
        return res.status(isAdmin.status).json(isAdmin.isAdmin);
      }
      return res.status(isAdmin.status).json(isAdmin.isAdmin);
    } catch (error) {}
  }
}

export default AdminController;
