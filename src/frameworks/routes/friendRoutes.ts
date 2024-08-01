import express from "express";
import FriendUseCase from "../../usecase/friendUsecase";
import FriendController from "../../controllers/friendController";
import FriendRepository from "../../repository/friendRepository";
import errorHandle from "../middlewares/errorHandle";
import userAuth from "../middlewares/userAuth";

const friendRouter = express.Router();

//repositories
const friendRepository = new FriendRepository();

//useCases
const friendCase = new FriendUseCase(friendRepository);

//controllers
const friendController = new FriendController(friendCase);

friendRouter.get("/getGlobalFriends/:userId", userAuth, (req, res, next) => {
  friendController.getGlobalFriend(req, res, next);
});

friendRouter.post("/addFriend", userAuth, (req, res, next) => {
  friendController.addFriend(req, res, next);
});

friendRouter.get("/getFriends/:userId", userAuth, (req, res, next) => {
  friendController.getFriends(req, res, next);
});

friendRouter.get("/getAllUsers", userAuth, (req, res, next) => {
  friendController.fetchAllUsers(req, res, next);
});

friendRouter.patch("/removeFriend", userAuth, (req, res, next) => {
  friendController.removeFriend(req, res, next);
});

friendRouter.use(errorHandle);

export default friendRouter;
