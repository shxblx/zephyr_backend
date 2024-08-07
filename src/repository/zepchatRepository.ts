import zepChatModel from "../frameworks/models/zepchatModel";
import User from "../entities/user";
import Zepchat from "../entities/zepChat";
import UserModel from "../frameworks/models/userModel";
import ZepReply from "../entities/zepReply";
import ZepReplyModel from "../frameworks/models/zepReplyModel";
import ZepchatModel from "../frameworks/models/zepchatModel";

class ZepchatRepository {
  async createZepchat(zepchatData: Zepchat): Promise<Zepchat> {
    const zepchat = new zepChatModel(zepchatData);
    return await zepchat.save();
  }

  async getZepchats(): Promise<Zepchat[]> {
    return await zepChatModel.find();
  }

  async findUserById(userId: string): Promise<User | null> {
    const user = await UserModel.findById(userId).exec();
    return user;
  }

  async postReply(zepReply: ZepReply): Promise<ZepReply> {
    const reply = new ZepReplyModel(zepReply);
    return await reply.save();
  }

  async fetchReplies(zepChatId: string): Promise<ZepReply[]> {
    return await ZepReplyModel.find({ zepChatId: zepChatId });
  }

  async fetchZepchatById(zepChatId: string): Promise<Zepchat | null> {
    return await zepChatModel.findOne({ _id: zepChatId });
  }

  async getReplyById(replyId: String): Promise<ZepReply | null> {
    return await ZepReplyModel.findById(replyId);
  }

  async voteSave(zepReply: ZepReply): Promise<ZepReply | null> {
    const updateVote = new ZepReplyModel(zepReply);
    return updateVote.save();
  }

  async ZepchatSave(zepchat: Zepchat): Promise<Zepchat | null> {
    const updateVote = new ZepchatModel(zepchat);
    return updateVote.save();
  }

  async deleteZepchat(zepchatId: string): Promise<any> {
    return await ZepchatModel.deleteOne({ _id: zepchatId });
  }

  async clearReplies(zepchatId: string): Promise<any> {
    return await ZepReplyModel.deleteMany({ zepChatId: zepchatId });
  }

}

export default ZepchatRepository;
