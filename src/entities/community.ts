import mongoose from "mongoose";

interface Community {
    _id?: string;
    name: string;
    description: string;
    hashtags: string[];
    isPrivate: boolean;
    profilePicture?: string;
    members: mongoose.Types.ObjectId[];
    admins: mongoose.Types.ObjectId[];
    coAdmins: mongoose.Types.ObjectId[];
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export default Community;