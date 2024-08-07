import mongoose, { Model, Schema, Document } from "mongoose";
import CommunityReports from "../../entities/communityReport";

const reportSchema: Schema<CommunityReports & Document> = new Schema({
  reporterId: {
    type: Schema.Types.ObjectId,
    ref: "Community",
    required: true,
  },
  reportedCommunityId: {
    type: Schema.Types.ObjectId,
    ref: "Community",
    required: true,
  },
  reporterUser: {
    type: String,
    required: true,
  },
  reportedCommunity: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CommunityReportsModel: Model<CommunityReports & Document> =
  mongoose.model<CommunityReports & Document>("CommunityReport", reportSchema);

export default CommunityReportsModel;
