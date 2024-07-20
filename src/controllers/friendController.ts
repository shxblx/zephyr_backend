import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import FriendUseCase from "../usecase/friendUsecase";
dotenv.config();



class FriendController {
    private _friendUsecase: FriendUseCase

    constructor(friendUsecase: FriendUseCase) {
        this._friendUsecase = friendUsecase
    }

    async getGlobalFriend(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.params.userId);

            const friendData = await this._friendUsecase.getGfriends(req.params.userId)

            if (friendData?.status === 200) {
                return res.status(friendData.status).json(friendData.friendsData)
            }
            return res.status(friendData?.status).json(friendData?.message)
        } catch (error) {
            next()
        }
    }

    async addFriend(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, friendId } = req.body
            const friendAdded = await this._friendUsecase.addFriend(userId, friendId)
            return res.status(friendAdded.status).json(friendAdded.message)
        } catch (error) {
            next(error)
        }
    }
}

export default FriendController