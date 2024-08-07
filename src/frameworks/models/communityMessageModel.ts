import mongoose, { Model, Schema, Document } from "mongoose";
import CommunityMessage from "../../entities/communityMessage";

const communityMessageSchema: Schema<CommunityMessage & Document> = new Schema(
  {
    communityId: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profilePicture: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
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

const CommunityMessageModel: Model<CommunityMessage & Document> =
  mongoose.model<CommunityMessage & Document>(
    "CommunityMessage",
    communityMessageSchema
  );

export default CommunityMessageModel;
