import express from "express";
import AdminRepository from "../../repository/adminRepository";
import AdminUsecase from "../../usecase/adminUsecase";
import AdminController from "../../controllers/adminController";
import EncryptPassword from "../utils/bcryptPassword";
import JWTToken from "../utils/generateToken";
import errorHandle from "../middlewares/errorHandle";
import adminAuth from "../middlewares/adminAuth"; // Import middleware

const adminRouter = express.Router();

// Import services, repositories, usecases, and controller
const encryptPassword = new EncryptPassword();
const jwtToken = new JWTToken();
const adminRepository = new AdminRepository();
const adminCase = new AdminUsecase(adminRepository, encryptPassword, jwtToken);
const adminController = new AdminController(adminCase);

// Apply middleware to routes where authentication is required
adminRouter.post("/login", (req, res, next) => {
  adminController.adminLogin(req, res, next);
});

adminRouter.get("/getUsers", adminAuth, (req, res, next) => {
  adminController.getUsers(req, res, next);
});

adminRouter.post("/blockUser", adminAuth, (req, res, next) => {
  adminController.blockUser(req, res, next);
});

adminRouter.post("/unblockUser", adminAuth, (req, res, next) => {
  adminController.unBlockUser(req, res, next);
});

adminRouter.use(errorHandle);

export default adminRouter;
