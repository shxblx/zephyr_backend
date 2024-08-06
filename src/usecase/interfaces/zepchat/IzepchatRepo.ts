import User from "../../../entities/user";
import Zepchat from "../../../entities/zepChat";
import ZepReply from "../../../entities/zepReply";

interface ZepchatRepo {
  createZepchat(zepchatData: Partial<Zepchat>): Promise<Zepchat>;
  getZepchats(): Promise<Zepchat[]>;
  findById(userId: string): Promise<User | null>;
  postReply(zepReply: ZepReply): Promise<ZepReply>;
  fetchReplies(zepChatId: string): Promise<ZepReply[] | null>;
  fetchZepchatById(zepChatId: string): Promise<Zepchat | null>;
}

export default ZepchatRepo;
