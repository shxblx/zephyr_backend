import mongoose from "mongoose";

interface Conversation {
  _id?: mongoose.Types.ObjectId;
  members: Array<{
    userId: string;
  }>;
  isGroup: boolean;
  groupName: string;
}

export default Conversation;
