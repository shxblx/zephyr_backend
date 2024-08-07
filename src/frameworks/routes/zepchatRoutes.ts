import express from "express";
import ZepchatRepository from "../../repository/zepchatRepository";
import ZepchatUseCase from "../../usecase/zepchatUsecase";
import ZepchatController from "../../controllers/zepchatController";
import userAuth from "../middlewares/userAuth";
import errorHandle from "../middlewares/errorHandle";

const zepchatRouter = express.Router();

//repositories
const zepchatRepository = new ZepchatRepository();

const zepchatCase = new ZepchatUseCase(zepchatRepository);

const zepchatController = new ZepchatController(zepchatCase);

zepchatRouter.post("/newZepchat", userAuth, (req, res, next) => {
  zepchatController.newZepchat(req, res, next);
});

zepchatRouter.get("/getZepchats", userAuth, (req, res, next) => {
  zepchatController.getZepchats(req, res, next);
});

zepchatRouter.post("/postReply", userAuth, (req, res, next) => {
  zepchatController.postReply(req, res, next);
});

zepchatRouter.get("/getReplies/:zepChatId", userAuth, (req, res, next) => {
  zepchatController.getReplies(req, res, next);
});

zepchatRouter.get("/getZepchatById/:zepChatId", userAuth, (req, res, next) => {
  zepchatController.getZepchatById(req, res, next);
});

zepchatRouter.patch("/replyVote", userAuth, (req, res, next) => {
  zepchatController.replyVote(req, res, next);
});

zepchatRouter.patch("/voteZepchat", userAuth, (req, res, next) => {
  zepchatController.voteZepchat(req, res, next);
});

zepchatRouter.patch("/deleteZepchat", userAuth, (req, res, next) => {
  zepchatController.deleteZepchat(req, res, next);
});

zepchatRouter.patch("/updateZepchat", userAuth, (req, res, next) => {
  zepchatController.updateZepchat(req, res, next);
});

zepchatRouter.use(errorHandle);

export default zepchatRouter;
