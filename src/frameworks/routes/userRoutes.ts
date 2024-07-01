import express from "express";
import UserController from "../../controllers/userController";
import UserUsecase from "../../usecase/userUsecase";
import UserRepository from "../../repository/userRepository";
import GenerateOtp from "../utils/generateOtp";
import EncryptPassword from "../utils/bcryptPassword";

const userRouter = express.Router();

//services
const generateOtp=new GenerateOtp()
const ecryptPassword=new EncryptPassword()


//repositories
const userRepository=new UserRepository()


//useCases
const userCase=new UserUsecase(userRepository,generateOtp,ecryptPassword)

//controllers
const userController = new UserController(userCase);

userRouter.post("/signup",(req,res,next)=>userController.signUp(req,res,next));

export default userRouter;
