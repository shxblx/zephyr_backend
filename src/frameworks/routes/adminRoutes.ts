import express from "express";
import AdminRepository from "../../repository/adminRepository";
import AdminUsecase from "../../usecase/adminUsecase";
import AdminController from "../../controllers/adminController";
import EncryptPassword from "../utils/bcryptPassword";
import JWTToken from "../utils/generateToken";
import errorHandle from "../middlewares/errorHandle";

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

adminRouter.post("/blockUser", (req, res, next) => {
  adminController.blockUser(req, res, next)
})

adminRouter.post("/unblockUser", (req, res, next) => {
  adminController.unBlockUser(req, res, next);
})

adminRouter.use(errorHandle);

export default adminRouter;
