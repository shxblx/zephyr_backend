import mongoose from "mongoose";

interface Friend {
  userId: string;
  friends: Array<{
    friendId: mongoose.Types.ObjectId;
    status: "pending" | "accepted";
    createdAt: Date;
  }>;
}

export default Friend;
