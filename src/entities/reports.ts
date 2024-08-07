import mongoose, { Types } from "mongoose";

interface Reports {
  reporterId: mongoose.Types.ObjectId;
  reportedUserId: mongoose.Types.ObjectId;
  reporterUser: string;
  reportedUser: string;
  subject: string;
  reason: string;
  createdAt?: Date;
}

export default Reports;
