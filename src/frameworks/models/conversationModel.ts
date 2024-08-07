import mongoose, { Model, Schema } from "mongoose";
import Conversation from "../../entities/conversation";

const conversationSchema: Schema<Conversation> = new Schema(
  {
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    isGroup: {
      type: Boolean,
      required: true,
    },
    groupName: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const conversationModel: Model<Conversation> = mongoose.model<Conversation>(
  "Conversation",
  conversationSchema
);

export default conversationModel;
