import mongoose, { Model, Schema, Document } from "mongoose";
import Community from "../../entities/community";

const communitySchema: Schema<Community & Document> = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    hashtags: [{
        type: String,
        required: true,
    }],
    isPrivate: {
        type: Boolean,
        default: false,
    },
    isBanned: { 
        type: Boolean,
        default: false,
    },
    profilePicture: {
        type: String,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

const CommunityModel: Model<Community & Document> = mongoose.model<Community & Document>(
    "Community",
    communitySchema
);

export default CommunityModel;