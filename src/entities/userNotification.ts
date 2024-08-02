import mongoose from "mongoose";

interface UserNotifications {
  userId: mongoose.Types.ObjectId;
  notifications: Array<{
    category: "friends" | "community" | "zepchats" | "others";
    _id?: mongoose.Types.ObjectId;
    profile?: string;
    message: string;
    type: string;
    timestamp: Date;
  }>;
}

export default UserNotifications;
