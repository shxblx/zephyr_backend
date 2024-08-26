import mongoose from "mongoose";

interface Ticket {
  userId: mongoose.Types.ObjectId;
  subject: string;
  description: string;
  status: string;
  created: Date;
  adminReplies: Array<{
    Reply:string
  }>;
}

export default Ticket