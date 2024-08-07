import mongoose, { Types } from "mongoose";

interface CommunityReports {
  reporterId: mongoose.Types.ObjectId;
  reportedCommunityId: mongoose.Types.ObjectId;
  reporterUser: string;
  reportedCommunity: string;
  subject: string;
  reason: string;
  createdAt?: Date;
}

export default CommunityReports;
