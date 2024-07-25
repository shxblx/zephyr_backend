import express from "express";
import CommunityUsecase from "../../usecase/communityUsecase";
import CommunityController from "../../controllers/communityController";
import CommunityRepository from "../../repository/communityRepository";
import errorHandle from "../middlewares/errorHandle";
import userAuth from "../middlewares/userAuth";
import upload from "../middlewares/multer";


const communityRouter = express.Router()

//repositories
const communityRepository = new CommunityRepository()

//useCases
const communityCase = new CommunityUsecase(communityRepository)

//controllers
const communityController = new CommunityController(communityCase)

communityRouter.post("/createCommunity", userAuth, upload.single('profilePicture'), (req, res, next) => {
    communityController.createCommunity(req, res, next);
});

communityRouter.get("/getCommunities/:userId", userAuth, (req, res, next) => {
    communityController.getCommunities(req, res, next);
});

communityRouter.patch("/joinCommunity", userAuth, (req, res, next) => {
    communityController.joinCommunity(req, res, next)
})

communityRouter.get("/getMyCommunity/:userId", userAuth, (req, res, next) => {
    communityController.getMyCommunities(req, res, next)
})

communityRouter.patch("/leaveCommunity", userAuth, (req, res, next) => {
    communityController.leaveCommunity(req, res, next)
})

communityRouter.get("/getMembers/:communityId", userAuth, (req, res, next) => {
    communityController.getMembers(req, res, next)
})



communityRouter.use(errorHandle);

export default communityRouter;
