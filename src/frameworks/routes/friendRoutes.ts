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

friendRouter.patch("/acceptFriendRequest", userAuth, (req, res, next) => {
  friendController.acceptFriendRequest(req, res, next);
});

friendRouter.patch("/rejectFriendRequest", userAuth, (req, res, next) => {
  friendController.rejectFriendRequest(req, res, next);
});

friendRouter.post("/sendMessage", userAuth, (req, res, next) => {
  friendController.sendMessage(req, res, next);
});
friendRouter.get("/fetchMessages/:membersId", userAuth, (req, res, next) => {
  friendController.fetchMessages(req, res, next);
});
friendRouter.post("/reportUser", userAuth, (req, res, next) => {
  friendController.reportUser(req, res, next);
});

friendRouter.get("/findNearbyFriends", userAuth, (req, res, next) => {
  friendController.findNearbyFriends(req, res, next);
});

friendRouter.post("/setUserLocation", userAuth, (req, res, next) => {
  friendController.setUserLocation(req, res, next);
});

friendRouter.use(errorHandle);

export default friendRouter;
