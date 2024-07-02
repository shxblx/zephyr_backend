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
