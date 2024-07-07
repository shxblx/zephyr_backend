import express from "express";
import AdminRepository from "../../repository/adminRepository";
import AdminUsecase from "../../usecase/adminUsecase";
import AdminController from "../../controllers/adminController";
import EncryptPassword from "../utils/bcryptPassword";
import JWTToken from "../utils/generateToken";

const adminRouter = express.Router();

//services
const encryptPassword = new EncryptPassword();
const jwtToken = new JWTToken();

//repositories
const adminRepository = new AdminRepository();

//usecase
const adminCase = new AdminUsecase(adminRepository, encryptPassword, jwtToken);

const adminController = new AdminController(adminCase);

adminRouter.post("/login", (req, res, next) => {
  adminController.adminLogin(req, res, next);
});

adminRouter.get("/getUsers", (req, res, next) => {
  adminController.getUsers(req, res, next);
});

export default adminRouter;
