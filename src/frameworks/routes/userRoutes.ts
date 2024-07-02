import express from "express";
import UserController from "../../controllers/userController";
import UserUsecase from "../../usecase/userUsecase";
import UserRepository from "../../repository/userRepository";
import GenerateOtp from "../utils/generateOtp";
import EncryptPassword from "../utils/bcryptPassword";
import EncryptOtp from "../utils/bcryptOtp";
import sendOtp from "../utils/sendMail";
import JWTToken from "../utils/generateToken";

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
  jwtToken
);

//controllers
const userController = new UserController(userCase);

userRouter.post("/signup", (req, res, next) =>
  userController.signUp(req, res, next)
);

userRouter.post("/verifyOtp", (req, res, next) =>
  userController.verifyOtp(req, res, next)
);

export default userRouter;
