import mongoose, { Model, Schema, Document } from "mongoose";
import UserNotifications from "../../entities/userNotification";

const userNotificationsSchema: Schema<UserNotifications & Document> =
  new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notifications: [
      {
        category: {
          type: String,
          enum: ["friends", "community", "zepchats", "others"],
          required: true,
        },
        _id: {
          type: Schema.Types.ObjectId,
        },
        profile: {
          type: String,
        },
        message: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  });

const UserNotificationsModel: Model<UserNotifications & Document> =
  mongoose.model<UserNotifications & Document>(
    "UserNotifications",
    userNotificationsSchema
  );

export default UserNotificationsModel;
