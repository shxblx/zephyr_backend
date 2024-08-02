import mongoose from "mongoose";
import User from "../entities/user";
import UserModel from "../frameworks/models/userModel";
import FriendRepo from "../usecase/interfaces/friends/IfriendsRepo";
import Friend from "../entities/friends";
import FriendModel from "../frameworks/models/friendModel";
import UserNotificationsModel from "../frameworks/models/UserNotificationsModel";

class FriendRepository implements FriendRepo {
  async getGfriends(
    currentUserId: string,
    searchTerm?: string
  ): Promise<{ users: {}[] }> {
    const currentUserFriends = await FriendModel.findOne({
      userId: currentUserId,
    })
      .select("friends.friendId")
      .lean();

    let friendIds: mongoose.Types.ObjectId[] = [];
    if (currentUserFriends && currentUserFriends.friends) {
      friendIds = currentUserFriends.friends.map((friend) => friend.friendId);
    }

    let matchQuery: any = {
      _id: { $nin: [...friendIds, new mongoose.Types.ObjectId(currentUserId)] },
      isBlocked: false,
    };

    if (searchTerm) {
      matchQuery.$or = [
        { userName: { $regex: searchTerm, $options: "i" } },
        { displayName: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const users = await UserModel.aggregate([
      { $match: matchQuery },
      { $sample: { size: searchTerm ? 100 : 10 } },
      {
        $project: {
          _id: 1,
          userName: 1,
          displayName: 1,
          profilePicture: 1,
        },
      },
    ]);

    return { users };
  }

  async findFriendRepo(id: string): Promise<Friend | null> {
    return FriendModel.findOne({ userId: id }).lean().exec();
  }

  async saveFriend(userId: string, friendId: string): Promise<Friend | null> {
    try {
      const newFriend = await FriendModel.findOneAndUpdate(
        { userId: userId },
        {
          $addToSet: {
            friends: {
              friendId: new mongoose.Types.ObjectId(friendId),
              status: "pending",
              createdAt: new Date(),
            },
          },
        },
        { upsert: true, new: true }
      ).lean();

      return newFriend;
    } catch (error) {
      console.error("Error in saveFriend:", error);
      throw error;
    }
  }

  async addNotification(userId: string, notification: any): Promise<void> {
    try {
      await UserNotificationsModel.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId) },
        {
          $push: {
            notifications: notification,
          },
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error("Error in addNotification:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    return UserModel.findById(id).lean().exec();
  }

  async fetchFriends(userId: string): Promise<Friend | null> {
    try {
      const friendsDoc = await FriendModel.findOne({ userId: userId })
        .lean()
        .exec();

      if (
        !friendsDoc ||
        !friendsDoc.friends ||
        friendsDoc.friends.length === 0
      ) {
        return null;
      }

      const acceptedFriends = friendsDoc.friends.filter(
        (friend) => friend.status === "accepted"
      );

      if (acceptedFriends.length === 0) {
        return null;
      }

      const friendIds = acceptedFriends.map((friend) => friend.friendId);

      const friends = await UserModel.aggregate([
        { $match: { _id: { $in: friendIds } } },
        {
          $project: {
            _id: 1,
            userName: 1,
            displayName: 1,
            profilePicture: 1,
            status: 1,
          },
        },
      ]);

      const result: Friend = {
        userId: userId,
        friends: friends.map((friend) => ({
          friendId: friend._id,
          createdAt: new Date(),
          ...friend,
        })),
      };

      return result;
    } catch (error) {
      console.error("Error in fetchFriends repository:", error);
      throw error;
    }
  }

  async getAllUsers(searchTerm?: string): Promise<{ users: {}[] }> {
    try {
      let matchQuery: any = {};

      if (searchTerm) {
        matchQuery.$or = [
          { userName: { $regex: searchTerm, $options: "i" } },
          { displayName: { $regex: searchTerm, $options: "i" } },
        ];
      }

      const users = await UserModel.aggregate([
        { $match: matchQuery },
        { $sample: { size: searchTerm ? 100 : 10 } },
        {
          $project: {
            _id: 1,
            userName: 1,
            displayName: 1,
            profilePicture: 1,
            status: 1,
          },
        },
      ]);

      return { users };
    } catch (error) {
      console.error("Error in getAllUsers repository:", error);
      throw error;
    }
  }

  async removeFriend(userId: string, friendId: string): Promise<Friend | null> {
    try {
      const updatedFriend = await FriendModel.findOneAndUpdate(
        { userId: userId },
        {
          $pull: {
            friends: { friendId: new mongoose.Types.ObjectId(friendId) },
          },
        },
        { new: true }
      )
        .lean()
        .exec();
      await FriendModel.findOneAndUpdate(
        { userId: friendId },
        {
          $pull: {
            friends: { friendId: new mongoose.Types.ObjectId(userId) },
          },
        },
        { new: true }
      )
        .lean()
        .exec();

      return updatedFriend;
    } catch (error) {
      console.error("Error in removeFriend repository:", error);
      throw error;
    }
  }

  async acceptFriendRequest(
    userId: string,
    friendId: string
  ): Promise<Friend | null> {
    try {
      const userFriend = await FriendModel.findOneAndUpdate(
        { userId: userId },
        {
          $addToSet: {
            friends: {
              friendId: new mongoose.Types.ObjectId(friendId),
              status: "accepted",
              createdAt: new Date(),
            },
          },
        },
        { upsert: true, new: true }
      );

      console.log(userFriend);

      await FriendModel.findOneAndUpdate(
        {
          userId: friendId,
          "friends.friendId": new mongoose.Types.ObjectId(userId),
        },
        {
          $set: { "friends.$.status": "accepted" },
        }
      );

      await UserNotificationsModel.findOneAndUpdate(
        { userId: userId },
        {
          $pull: {
            notifications: {
              _id: new mongoose.Types.ObjectId(friendId),
            },
          },
        }
      );

      return userFriend;
    } catch (error) {
      console.error("Error in acceptFriendRequest:", error);
      throw error;
    }
  }

  async rejectFriendRequest(
    userId: string,
    friendId: string
  ): Promise<Friend | null> {
    try {
      const updatedFriend = await FriendModel.findOneAndUpdate(
        { userId: userId },
        {
          $pull: {
            friends: { friendId: new mongoose.Types.ObjectId(friendId) },
          },
        },
        { new: true }
      ).lean();

      await FriendModel.findOneAndUpdate(
        { userId: friendId },
        {
          $pull: {
            friends: { friendId: new mongoose.Types.ObjectId(userId) },
          },
        }
      );

      await UserNotificationsModel.findOneAndUpdate(
        { userId: userId },
        {
          $pull: {
            notifications: {
              _id: new mongoose.Types.ObjectId(friendId),
            },
          },
        }
      );

      return updatedFriend;
    } catch (error) {
      console.log("Error rejecting friend request:", error);
      throw error;
    }
  }
}

export default FriendRepository;
