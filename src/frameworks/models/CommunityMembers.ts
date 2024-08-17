import mongoose, { Model, Schema, Document } from "mongoose";
import CommunityMembers from "../../entities/communityMembers";

const communityMemberSchema: Schema<CommunityMembers & Document> = new Schema({
    communityId: {
        type: Schema.Types.ObjectId,
        ref: 'Community',
        required: true,
    },
    members: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        joinedAt: {
            type: Date,
            default: Date.now,
        },
    }],
    admin: {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },  
}, {
    timestamps: true,
});

const CommunityMemberModel: Model<CommunityMembers & Document> = mongoose.model<CommunityMembers & Document>(
    "CommunityMembers",
    communityMemberSchema
);

export default CommunityMemberModel;
