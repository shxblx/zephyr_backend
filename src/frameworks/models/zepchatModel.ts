import mongoose, { Model, Schema, Document } from "mongoose";
import Zepchat from "../../entities/zepChat";

interface ZepchatDocument extends Zepchat, Document {}

const ZepchatSchema: Schema<ZepchatDocument> = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: true,
    },
  },
  tags: {
    type: [String],
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
  timestamp: {
    type: Date,
    default: Date.now,
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
});

const ZepchatModel: Model<ZepchatDocument> = mongoose.model<ZepchatDocument>(
  "Zepchat",
  ZepchatSchema
);

export default ZepchatModel;
