import mongoose from "mongoose";

interface Zepchat {
  title: string;
  content: string;
  author: {
    _id: mongoose.Types.ObjectId;
    displayName: string;
    profilePicture: string;
  };
  tags: string[];
  upVotes: number;
  downVotes: number;
  timestamp: Date;
  upVoters?: Array<{
    userId: mongoose.Types.ObjectId;
  }>;
  downVoters?: Array<{
    userId: mongoose.Types.ObjectId;
  }>;
}

export default Zepchat;
