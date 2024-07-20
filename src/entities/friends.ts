import mongoose from 'mongoose';

interface Friend {
    userId: string;
    friends: Array<{
        friendId: mongoose.Types.ObjectId;
        createdAt: Date;
    }>;
}

export default Friend;