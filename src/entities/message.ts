import mongoose from "mongoose";

interface Message {
  conversationId: mongoose.Types.ObjectId | string;
  sender: mongoose.Types.ObjectId | string;
  content: string;
  timestamp?: Date;
}

export default Message;
