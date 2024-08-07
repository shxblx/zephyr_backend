import mongoose from "mongoose";

interface CommunityMessage {
  communityId: mongoose.Types.ObjectId | string;
  sender: mongoose.Types.ObjectId | string;
  profilePicture: string;
  userName: string;
  content: string;
  timestamp?: Date;
}

export default CommunityMessage;
