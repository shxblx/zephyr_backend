import mongoose, { Model, Schema, Document } from "mongoose";
import User from "../../entities/user";

const userSchema: Schema<User & Document> = new Schema({
  userName: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  wallet: {
    type: Number,
    default: 0,
  },
  profilePicture: {
    type: String,
    default:
      "https://res.cloudinary.com/dsm0j8tzn/image/upload/v1720163434/_399e0eec-d6af-4840-8de3-0f8e60d8f9f1_wbqa0y.jpg",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const UserModel: Model<User & Document> = mongoose.model<User & Document>(
  "User",
  userSchema
);

export default UserModel;
