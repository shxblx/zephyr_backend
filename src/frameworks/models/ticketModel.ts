import mongoose, { Schema, Model, Document } from "mongoose";
import Ticket from "../../entities/ticket";

// Create an interface that extends both Document and Ticket
interface TicketModel extends Ticket, Document {}

const TicketSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "Open" },
  created: { type: Date, default: Date.now },
  adminReplies: [{ 
    Reply: { type: String }
  }]
});

const TicketModel: Model<TicketModel> = mongoose.model<TicketModel>(
  "Ticket",
  TicketSchema
);

export default TicketModel;