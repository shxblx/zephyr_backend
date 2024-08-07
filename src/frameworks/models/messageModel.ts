import mongoose, { Model, Schema, Document } from "mongoose";
import Message from "../../entities/message";

interface MessageDocument extends Message, Document {}

const messageSchema: Schema<MessageDocument> = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const MessageModel: Model<MessageDocument> = mongoose.model<MessageDocument>(
  "Message",
  messageSchema
);

export default MessageModel;
