import mongoose, { Model, Schema, Document } from "mongoose";
import Friend from "../../entities/friends";

const friendSchema: Schema = new Schema<Friend>({
  userId: {
    type: String,
    required: true,
  },
  friends: [
    {
      friendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "accepted"],
        required: true,
        default: "pending",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const FriendModel: Model<Friend & Document> = mongoose.model<Friend & Document>(
  "Friend",
  friendSchema
);

export default FriendModel;
