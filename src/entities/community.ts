import mongoose from "mongoose";

interface Community {
    _id?: string;
    name: string;
    description: string;
    hashtags: string[];
    isPrivate: boolean;
    isBanned?: boolean;
    profilePicture?: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export default Community;