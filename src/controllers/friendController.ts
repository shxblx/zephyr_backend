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

  async acceptFriendRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, friendId } = req.body;
      const accepted = await this._friendUsecase.acceptFriend(userId, friendId);

      return res.status(accepted.status).json(accepted.message);
    } catch (error) {
      next(error);
    }
  }

  async rejectFriendRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, friendId } = req.body;
      const rejected = await this._friendUsecase.rejectFriend(userId, friendId);
      return res.status(rejected.status).json(rejected.message);
    } catch (error) {
      next(error);
    }
  }
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { senderId, receiverId, content, fileUrl, fileType } = req.body;
      const messageSend = await this._friendUsecase.sendMessage(
        senderId,
        receiverId,
        content,
        fileUrl,
        fileType
      );

      return res.status(messageSend.status).json(messageSend.message);
    } catch (error) {
      next(error);
    }
  }

  async fetchMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const membersId = req.params.membersId;
      const [member1, member2] = membersId.split("-");

      if (!member1 || !member2) {
        return res.status(400).json({ error: "Invalid membersId format" });
      }

      const messages = await this._friendUsecase.getMessages(member1, member2);

      if (messages.status === 200) {
        return res.status(messages.status).json(messages.data);
      }
      return res.status(messages.status).json(messages.message);
    } catch (error) {
      next(error);
    }
  }

  async reportUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { reporterId, reportedUserId, subject, reason } = req.body;
      console.log("here");

      const report = await this._friendUsecase.reportUser(
        reporterId,
        reportedUserId,
        subject,
        reason
      );
      return res.status(report.status).json(report.message);
    } catch (error) {
      next(error);
    }
  }
  async findNearbyFriends(req: Request, res: Response, next: NextFunction) {
    try {
      const { latitude, longitude } = req.query;
      const userId = req.query.userId as string;
      const friends = await this._friendUsecase.findNearbyNonFriends(
        userId,
        latitude,
        longitude
      );
      if (friends.status === 200) {
        return res.status(friends.status).json(friends.data);
      }
      return res.status(friends.status).json(friends.message);
    } catch (error) {
      next(error);
    }
  }

  async setUserLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, newLocation } = req.body;
      const setLocation = await this._friendUsecase.setLocation(
        userId,
        newLocation.latitude,
        newLocation.longitude
      );
      return;
    } catch (error) {
      next(error);
    }
  }

  async sendFiletoFriends(req: Request, res: Response, next: NextFunction) {
    try {
      const selectedFile = req.file;
      if (!selectedFile) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const fileSend = await this._friendUsecase.sendFiletoFriends(
        selectedFile
      );
      if (fileSend.status === 200) {
        return res.status(fileSend.status).json({ fileUrl: fileSend.fileUrl });
      }
      return res.status(fileSend.status).json({ message: fileSend.message });
    } catch (error) {
      next(error);
    }
  }
}

export default FriendController;
