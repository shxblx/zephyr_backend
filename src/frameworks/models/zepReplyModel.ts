import mongoose, { Document, Model, Schema } from "mongoose";
import ZepReply from "../../entities/zepReply";

const zepReplySchema: Schema<ZepReply & Document> = new Schema(
  {
    zepChatId: {
      type: Schema.Types.ObjectId,
      ref: "Zepchat",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    upVotes: {
      type: Number,
      default: 0,
    },
    downVotes: {
      type: Number,
      default: 0,
    },
    upVoters: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    downVoters: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ZepReplyModel: Model<ZepReply & Document> = mongoose.model<
  ZepReply & Document
>("ZepReply", zepReplySchema);

export default ZepReplyModel;
