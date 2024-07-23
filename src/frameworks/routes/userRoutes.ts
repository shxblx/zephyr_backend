import express from "express";
import UserController from "../../controllers/userController";
import UserUsecase from "../../usecase/userUsecase";
import UserRepository from "../../repository/userRepository";
import GenerateOtp from "../utils/generateOtp";
import EncryptPassword from "../utils/bcryptPassword";
import EncryptOtp from "../utils/bcryptOtp";
import sendOtp from "../utils/sendMail";
import JWTToken from "../utils/generateToken";
import errorHandle from "../middlewares/errorHandle";
import upload from "../middlewares/multer";

const userRouter = express.Router();

//services
const generateOtp = new GenerateOtp();
const ecryptPassword = new EncryptPassword();
const encryptOtp = new EncryptOtp();
const generateMail = new sendOtp();
const jwtToken = new JWTToken();

//repositories
const userRepository = new UserRepository();

//useCases
const userCase = new UserUsecase(
  userRepository,
  generateOtp,
  ecryptPassword,
  encryptOtp,
  generateMail,
  jwtToken,
);

//controllers
const userController = new UserController(userCase);

userRouter.post("/signup", (req, res, next) => {
  userController.signUp(req, res, next);
});

userRouter.post("/verifyOtp", (req, res, next) => {
  userController.verifyOtp(req, res, next);
});

userRouter.post("/resendOtp", (req, res, next) => {
  userController.resendOtp(req, res, next);
});

userRouter.post("/login", (req, res, next) => {
  userController.login(req, res, next);
});

userRouter.post("/logout", (req, res, next) => {
  userController.logout(req, res, next);
});

userRouter.post("/forgotPassword", (req, res, next) => {
  userController.forgotPassword(req, res, next);
});

userRouter.post("/forgotVerify", (req, res, next) => {
  userController.forgotVerify(req, res, next);
});

userRouter.get('/getUser/:userId', (req, res, next) => {
  userController.getUser(req, res, next)
})

userRouter.put("/changeStatus", (req, res, next) => {
  userController.changeStatus(req, res, next)
})

userRouter.put("/changeUserName", (req, res, next) => {
  userController.changeUserName(req, res, next)
})
userRouter.put("/changeDisplayName", (req, res, next) => {
  userController.changeDisplayName(req, res, next)
})

userRouter.put("/changePassword", (req, res, next) => {
  userController.changePassword(req, res, next)
})

userRouter.put("/changeProfile", upload.single('profilePicture'), (req, res, next) => {
  userController.changeProfilePicture(req, res, next);
});

userRouter.use(errorHandle);

export default userRouter;
