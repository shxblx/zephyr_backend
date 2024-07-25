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
            const profile = req.file
            console.log(req.body);

            if (!profile) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }
            const { name, description, hashtags, isPrivate, selectedUsers, adminId } = req.body
            const parsedHashtags = JSON.parse(hashtags);
            const parsedSelectedUsers = JSON.parse(selectedUsers);
            const parsedIsPrivate = isPrivate === 'true';

            const created = await this._commuityUsecase.createCommunity(
                name,
                description,
                parsedHashtags,
                parsedIsPrivate,
                parsedSelectedUsers,
                adminId,
                profile
            )

            res.status(created.status).json(created.message)

        } catch (error) {
            next(error);
        }
    }
    async getCommunities(req: Request, res: Response, next: NextFunction) {
        try {

            const communities = await this._commuityUsecase.getCommunities(req.params.userId);

            res.status(200).json({
                success: true,
                data: communities,
            });
        } catch (error) {
            next(error);
        }
    }

    async joinCommunity(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, communityId } = req.body
            const joined = await this._commuityUsecase.joinCommunity(userId, communityId)


            return res.status(joined.status).json(joined.message)
        } catch (error) {
            next(error)
        }
    }

    async getMyCommunities(req: Request, res: Response, next: NextFunction) {
        try {
            const myCommunities = await this._commuityUsecase.fetchMyCommunities(req.params.userId)
            if (myCommunities.status === 200) {
                return res.status(myCommunities.status).json(myCommunities.data)
            }
            return res.status(myCommunities.status).json(myCommunities.message)
        } catch (error) {
            next(error)
        }
    }

    async leaveCommunity(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, communityId } = req.body

            const leaveCommunity = await this._commuityUsecase.leaveCommunity(userId, communityId)
            if (leaveCommunity.status === 200) {
                return res.status(leaveCommunity.status).json(leaveCommunity.message)
            }
            return res.status(leaveCommunity.status).json(leaveCommunity.message)
        } catch (error) {
            next(error)
        }
    }

    async getMembers(req: Request, res: Response, next: NextFunction) {
        try {
            const members = await this._commuityUsecase.getCommunityMembers(req.params.communityId)
            return res.status(members.status).json(members.data)
        } catch (error) {
            next(error)
        }
    }
}

export default CommunityController