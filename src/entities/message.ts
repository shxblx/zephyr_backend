import mongoose from "mongoose";

interface Message {
  conversationId: mongoose.Types.ObjectId | string;
  sender: mongoose.Types.ObjectId | string;
  content: string;
  timestamp?: Date;
  fileUrl?: string;
  fileType?: "image" | "video";
}

export default Message;
