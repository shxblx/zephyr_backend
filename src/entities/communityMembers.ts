import mongoose from "mongoose";

interface CommunityMembers {
    _id?: string;
    communityId: mongoose.Types.ObjectId;
    members: Array<{
        userId: mongoose.Types.ObjectId;
        joinedAt: Date;
    }>;
    admin: {
        userId: mongoose.Types.ObjectId;
    };
    createdAt: Date;
    updatedAt: Date;
}

export default CommunityMembers;
