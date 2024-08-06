import mongoose from "mongoose";

interface ZepReply {
  zepChatId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  profilePicture: string;
  displayName: string;
  upVotes: number;
  downVotes: number;
  upVoters?: Array<{
    userId: mongoose.Types.ObjectId;
  }>;
  downVoters?: Array<{
    userId: mongoose.Types.ObjectId;
  }>;
}

export default ZepReply;
