import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import CommunityUsecase from "../usecase/communityUsecase";
dotenv.config();



class CommunityController {
    private _commuityUsecase: CommunityUsecase

    constructor(commuityUsecase: CommunityUsecase) {
        this._commuityUsecase = commuityUsecase
    }


    async createCommunity(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.body);

        } catch (error) {

        }
    }

}

export default CommunityController