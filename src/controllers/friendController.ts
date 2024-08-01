import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import FriendUseCase from "../usecase/friendUsecase";
dotenv.config();

class FriendController {
  private _friendUsecase: FriendUseCase;

  constructor(friendUsecase: FriendUseCase) {
    this._friendUsecase = friendUsecase;
  }

  async getGlobalFriend(req: Request, res: Response, next: NextFunction) {
    try {
      const searchTerm = req.query.search as string | undefined;
      const friendData = await this._friendUsecase.getGfriends(
        req.params.userId,
        searchTerm
      );

      if (friendData?.status === 200) {
        return res.status(friendData.status).json(friendData.friendsData);
      }
      return res.status(friendData?.status).json(friendData?.message);
    } catch (error) {
      next(error);
    }
  }

  async addFriend(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, friendId } = req.body;
      const friendAdded = await this._friendUsecase.addFriend(userId, friendId);
      return res.status(friendAdded.status).json(friendAdded.message);
    } catch (error) {
      next(error);
    }
  }

  async getFriends(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this._friendUsecase.fetchFriends(req.params.userId);
      if (result.status === 200) {
        return res.status(result.status).json(result);
      } else {
        return res.status(result.status).json(result.message);
      }
    } catch (error) {
      next(error);
    }
  }

  async fetchAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const searchTerm = req.query.search as string | undefined;
      const result = await this._friendUsecase.getUsers(searchTerm);

      if (result.status === 200) {
        return res.status(result.status).json(result);
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      next(error);
    }
  }

  async removeFriend(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, friendId } = req.body;
      const friendRemoved = await this._friendUsecase.removeFriend(
        userId,
        friendId
      );

      return res.status(friendRemoved?.status).json(friendRemoved.message);
    } catch (error) {
      next(error);
    }
  }
}

export default FriendController;
