import zepChatModel from "../frameworks/models/zepchatModel";
import User from "../entities/user";
import Zepchat from "../entities/zepChat";
import UserModel from "../frameworks/models/userModel";
import ZepReply from "../entities/zepReply";
import ZepReplyModel from "../frameworks/models/zepReplyModel";
import ZepchatModel from "../frameworks/models/zepchatModel";
import UserNotificationsModel from "../frameworks/models/UserNotificationsModel";
import mongoose from "mongoose";

class ZepchatRepository {
  async createZepchat(zepchatData: Zepchat): Promise<Zepchat> {
    try {
      const zepchat = new zepChatModel(zepchatData);
      return await zepchat.save();
    } catch (error) {
      console.error("Error creating Zepchat:", error);
      throw error;
    }
  }

  async getZepchats(): Promise<Zepchat[]> {
    try {
      return await zepChatModel.find();
    } catch (error) {
      console.error("Error getting Zepchats:", error);
      throw error;
    }
  }

  async findUserById(userId: string): Promise<User | null> {
    try {
      const user = await UserModel.findById(userId).exec();
      return user;
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw error;
    }
  }

  async addNotification(userId: string, notification: any): Promise<void> {
    try {
      await UserNotificationsModel.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId) },
        {
          $push: {
            notifications: notification,
          },
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error("Error in addNotification:", error);
      throw error;
    }
  }

  async postReply(zepReply: ZepReply): Promise<ZepReply> {
    try {
      const reply = new ZepReplyModel(zepReply);
      return await reply.save();
    } catch (error) {
      console.error("Error posting reply:", error);
      throw error;
    }
  }

  async fetchReplies(zepChatId: string): Promise<ZepReply[]> {
    try {
      return await ZepReplyModel.find({ zepChatId: zepChatId });
    } catch (error) {
      console.error("Error fetching replies:", error);
      throw error;
    }
  }

  async fetchZepchatById(zepChatId: string): Promise<Zepchat | null> {
    try {
      return await zepChatModel.findOne({ _id: zepChatId });
    } catch (error) {
      console.error("Error fetching Zepchat by ID:", error);
      throw error;
    }
  }

  async getReplyById(replyId: String): Promise<ZepReply | null> {
    try {
      return await ZepReplyModel.findById(replyId);
    } catch (error) {
      console.error("Error getting reply by ID:", error);
      throw error;
    }
  }

  async voteSave(zepReply: ZepReply): Promise<ZepReply | null> {
    try {
      const updateVote = new ZepReplyModel(zepReply);
      return updateVote.save();
    } catch (error) {
      console.error("Error saving vote:", error);
      throw error;
    }
  }

  async ZepchatSave(zepchat: Zepchat): Promise<Zepchat | null> {
    try {
      const updateVote = new ZepchatModel(zepchat);
      return updateVote.save();
    } catch (error) {
      console.error("Error saving Zepchat:", error);
      throw error;
    }
  }

  async deleteZepchat(zepchatId: string): Promise<any> {
    try {
      return await ZepchatModel.deleteOne({ _id: zepchatId });
    } catch (error) {
      console.error("Error deleting Zepchat:", error);
      throw error;
    }
  }

  async clearReplies(zepchatId: string): Promise<any> {
    try {
      return await ZepReplyModel.deleteMany({ zepChatId: zepchatId });
    } catch (error) {
      console.error("Error clearing replies:", error);
      throw error;
    }
  }

  async fetchMyZepchats(userId: string): Promise<Zepchat[]> {
    try {
      return await ZepchatModel.find({ "author._id": userId });
    } catch (error) {
      console.error("Error fetching Zepchats:", error);
      throw error;
    }
  }
}

export default ZepchatRepository;
