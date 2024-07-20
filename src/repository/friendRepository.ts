import mongoose from 'mongoose';
import User from "../entities/user";
import UserModel from "../frameworks/models/userModel";
import FriendRepo from "../usecase/interfaces/friends/IfriendsRepo";
import Friend from "../entities/friends";
import FriendModel from "../frameworks/models/friendModel";

class FriendRepository implements FriendRepo {
    async getGfriends(currentUserId: string): Promise<{ users: {}[]; }> {
        const currentUserFriends = await FriendModel.findOne({ userId: currentUserId })
            .select('friends.friendId')
            .lean();

        let friendIds: mongoose.Types.ObjectId[] = [];
        if (currentUserFriends && currentUserFriends.friends) {
            friendIds = currentUserFriends.friends.map(friend => friend.friendId);
        }

        const users = await UserModel.find({
            _id: { $nin: [...friendIds, new mongoose.Types.ObjectId(currentUserId)] },
            isBlocked: false
        })
            .select('_id userName displayName profilePicture')
            .lean();

        return { users };
    }

    async findById(id: string): Promise<User | null> {
        return UserModel.findById(id).lean().exec();
    }

    async findFriendRepo(id: string): Promise<Friend | null> {
        return FriendModel.findOne({ userId: id }).lean().exec();
    }

    async saveFriend(friend: Friend): Promise<Friend | null> {
        const newFriend = new FriendModel(friend);
        const saved = await newFriend.save();
        return saved;
    }

    async saveUser(user: User): Promise<User | null> {
        const newUser = new UserModel(user);
        const savedUser = await newUser.save();
        return savedUser;
    }

    async addFriendToExisting(userId: string, friendId: string): Promise<Friend | null> {
        const updated = await FriendModel.findOneAndUpdate(
            {
                userId: userId,
                'friends.friendId': { $ne: new mongoose.Types.ObjectId(friendId) }
            },
            {
                $addToSet: {
                    friends: {
                        friendId: new mongoose.Types.ObjectId(friendId),
                        status: "Pending",
                        createdAt: new Date()
                    }
                }
            },
            { new: true }
        ).lean().exec();

        return updated;
    }
}

export default FriendRepository;