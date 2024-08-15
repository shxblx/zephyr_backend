// zepchatController.ts
import { Request, Response, NextFunction } from "express";
import ZepchatUseCase from "../usecase/zepchatUsecase";

class ZepchatController {
  private _zepchatUsecase: ZepchatUseCase;

  constructor(zepchatUsecase: ZepchatUseCase) {
    this._zepchatUsecase = zepchatUsecase;
  }

  async newZepchat(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, content, tags, userId } = req.body;
      const result = await this._zepchatUsecase.createZepchat(
        title,
        content,
        tags,
        userId
      );
      return res.status(result.status).json(result.message);
    } catch (error) {
      next(error);
    }
  }

  async getZepchats(req: Request, res: Response, next: NextFunction) {
    try {
      const zepchat = await this._zepchatUsecase.fetchZepchats();

      if (zepchat.status === 200) {
        return res.status(zepchat.status).json(zepchat.data);
      }
      return res.status(zepchat.status).json(zepchat.message);
    } catch (error) {
      next(error);
    }
  }
  async postReply(req: Request, res: Response, next: NextFunction) {
    try {
      const { zepChatId, userId, content } = req.body;
      const reply = await this._zepchatUsecase.postReply(
        zepChatId,
        userId,
        content
      );
      return res.status(reply.status).json(reply.message);
    } catch (error) {
      next(error);
    }
  }

  async getReplies(req: Request, res: Response, next: NextFunction) {
    try {
      const zepChatId = req.params.zepChatId;

      const zepReplies = await this._zepchatUsecase.getZepReplies(zepChatId);

      if (zepReplies.status === 200) {
        return res.status(zepReplies.status).json(zepReplies.data);
      }
      return res.status(zepReplies.status).json(zepReplies.message);
    } catch (error) {
      next(error);
    }
  }
  async getZepchatById(req: Request, res: Response, next: NextFunction) {
    try {
      const zepChatId = req.params.zepChatId;
      const zepReplies = await this._zepchatUsecase.getZepchat(zepChatId);
      if (zepReplies.status === 200) {
        return res.status(zepReplies.status).json(zepReplies.data);
      }
      return res.status(zepReplies.status).json(zepReplies.message);
    } catch (error) {
      next(error);
    }
  }

  async replyVote(req: Request, res: Response, next: NextFunction) {
    try {
      const { replyId, voteType, userId } = req.body;
      const voted = await this._zepchatUsecase.voteReply(
        replyId,
        voteType,
        userId
      );
      return res.status(voted.status).json(voted.message);
    } catch (error) {
      next(error);
    }
  }

  async voteZepchat(req: Request, res: Response, next: NextFunction) {
    try {
      const { zepchatId, voteType, userId } = req.body;
      const voted = await this._zepchatUsecase.voteZepchat(
        zepchatId,
        voteType,
        userId
      );
      return res.status(voted.status).json(voted.message);
    } catch (error) {
      next(error);
    }
  }

  async deleteZepchat(req: Request, res: Response, next: NextFunction) {
    try {
      const { zepchatId, userId } = req.body;
      const deleteZep = await this._zepchatUsecase.deleteZepchat(
        zepchatId,
        userId
      );

      return res.status(deleteZep.status).json(deleteZep.message);
    } catch (error) {
      next(error);
    }
  }

  async updateZepchat(req: Request, res: Response, next: NextFunction) {
    try {
      const { zepchatId, title, content, tags } = req.body;
      const deleteZep = await this._zepchatUsecase.updateZepchat(
        zepchatId,
        title,
        content,
        tags
      );

      return res.status(deleteZep.status).json(deleteZep.message);
    } catch (error) {
      next(error);
    }
  }

  async getMyZepchat(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const zepchats = await this._zepchatUsecase.getMyZepchats(userId);

      if (zepchats.status === 200) {
        return res.status(zepchats.status).json(zepchats.data);
      }
      return res.status(zepchats.status).json(zepchats.message);
    } catch (error) {
      next(error);
    }
  }
}

export default ZepchatController;
