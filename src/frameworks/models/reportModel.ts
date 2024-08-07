import mongoose, { Model, Schema, Document } from "mongoose";
import Reports from "../../entities/reports";

const reportSchema: Schema<Reports & Document> = new Schema({
  reporterId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reportedUserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reportedUser: {
    type: String,
  },
  reporterUser: {
    type: String,
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

const ReportModel: Model<Reports & Document> = mongoose.model<
  Reports & Document
>("Report", reportSchema);

export default ReportModel;
