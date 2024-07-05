import express from "express";
import AdminRepository from "../../repository/adminRepository";
import AdminUsecase from "../../usecase/adminUsecase";
import AdminController from "../../controllers/adminController";

const adminRouter = express.Router();

//services

//repositories
const adminRepository = new AdminRepository();

//usecase
const adminCase = new AdminUsecase(adminRepository);

const adminController = new AdminController(adminCase);

adminRouter.post("/login", (req, res, next) => {
  adminController.adminLogin(req, res, next);
});

export default adminRouter;
