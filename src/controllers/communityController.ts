import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import CommunityUsecase from "../usecase/communityUsecase";
dotenv.config();

class CommunityController {
  private _commuityUsecase: CommunityUsecase;

  constructor(commuityUsecase: CommunityUsecase) {
    this._commuityUsecase = commuityUsecase;
  }

  async createCommunity(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = req.file;

      if (!profile) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }
      const { name, description, hashtags, isPrivate, selectedUsers, adminId } =
        req.body;
      const parsedHashtags = JSON.parse(hashtags);
      const parsedSelectedUsers = JSON.parse(selectedUsers);
      const parsedIsPrivate = isPrivate === "true";

      const created = await this._commuityUsecase.createCommunity(
        name,
        description,
        parsedHashtags,
        parsedIsPrivate,
        parsedSelectedUsers,
        adminId,
        profile
      );

      res.status(created.status).json(created.message);
    } catch (error) {
      next(error);
    }
  }
  async getCommunities(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const search = req.query.search as string | undefined;

      const communities = await this._commuityUsecase.getCommunities(
        userId,
        search
      );

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
      const { userId, communityId } = req.body;
      const joined = await this._commuityUsecase.joinCommunity(
        userId,
        communityId
      );

      return res.status(joined.status).json(joined.message);
    } catch (error) {
      next(error);
    }
  }

  async getMyCommunities(req: Request, res: Response, next: NextFunction) {
    try {
      const myCommunities = await this._commuityUsecase.fetchMyCommunities(
        req.params.userId
      );
      if (myCommunities.status === 200) {
        return res.status(myCommunities.status).json(myCommunities.data);
      }
      return res.status(myCommunities.status).json(myCommunities.message);
    } catch (error) {
      next(error);
    }
  }

  async leaveCommunity(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, communityId } = req.body;

      const leaveCommunity = await this._commuityUsecase.leaveCommunity(
        userId,
        communityId
      );
      if (leaveCommunity.status === 200) {
        return res.status(leaveCommunity.status).json(leaveCommunity.message);
      }
      return res.status(leaveCommunity.status).json(leaveCommunity.message);
    } catch (error) {
      next(error);
    }
  }

  async getMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const members = await this._commuityUsecase.getCommunityMembers(
        req.params.communityId
      );
      return res.status(members.status).json(members.data);
    } catch (error) {
      next(error);
    }
  }

  async getCommunityById(req: Request, res: Response, next: NextFunction) {
    try {
      const communityId = req.params.communityId;

      const community = await this._commuityUsecase.getCommunityById(
        communityId
      );

      if (community.status === 200) {
        return res.status(community.status).json(community.data);
      }
      return res.status(community.status).json(community.message);
    } catch (error) {
      next(error);
    }
  }

  async removeMember(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, communityId } = req.body;
      const removed = await this._commuityUsecase.removeMember(
        userId,
        communityId
      );
      return res.status(removed?.status).json(removed?.message);
    } catch (error) {
      next(error);
    }
  }

  async sendCommunityMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        communityId,
        sender,
        userName,
        profilePicture,
        content,
        fileUrl,
        fileType,
      } = req.body;

      const message = await this._commuityUsecase.sendCommunityMessage(
        communityId,
        sender,
        userName,
        profilePicture,
        content,
        fileUrl,
        fileType
      );

      return res.status(message.status).json(message.message);
    } catch (error) {
      next(error);
    }
  }

  async getCommunityMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const messages = await this._commuityUsecase.getCommunityMessages(
        req.params.communityId
      );

      if (messages.status === 200) {
        return res.status(messages.status).json(messages.data);
      }
      return res.status(messages.status).json(messages.message);
    } catch (error) {
      next(error);
    }
  }

  async updateCommunity(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, tags, communityId } = req.body;
      const changed = await this._commuityUsecase.updateCommunity(
        name,
        description,
        tags,
        communityId
      );

      return res.status(changed.status).json(changed.message);
    } catch (error) {
      next(error);
    }
  }
  async communityReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { reporterId, reportedCommunityId, subject, reason } = req.body;
      const changed = await this._commuityUsecase.communityReport(
        reporterId,
        reportedCommunityId,
        subject,
        reason
      );

      return res.status(changed.status).json(changed.message);
    } catch (error) {
      next(error);
    }
  }
  async makeAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, communityId } = req.body;
      const changed = await this._commuityUsecase.makeAdmin(
        userId,
        communityId
      );

      return res.status(changed.status).json(changed.message);
    } catch (error) {
      next(error);
    }
  }
  async addMembertoTheCommunity(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, communityId } = req.body;
      const added = await this._commuityUsecase.addMembertoTheCommunity(
        userId,
        communityId
      );

      return res.status(added.status).json(added.message);
    } catch (error) {
      next(error);
    }
  }

  async sendFileToCommunity(req: Request, res: Response, next: NextFunction) {
    try {
      const selectedFile = req.file;
      if (!selectedFile) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const fileSend = await this._commuityUsecase.sendFileToCommunity(
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

export default CommunityController;
