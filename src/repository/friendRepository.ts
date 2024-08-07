import mongoose from "mongoose";
import User from "../entities/user";
import UserModel from "../frameworks/models/userModel";
import FriendRepo from "../usecase/interfaces/friends/IfriendsRepo";
import Friend from "../entities/friends";
import FriendModel from "../frameworks/models/friendModel";
import UserNotificationsModel from "../frameworks/models/UserNotificationsModel";
import conversationModel from "../frameworks/models/conversationModel";
import Conversation from "../entities/conversation";
import MessageModel from "../frameworks/models/messageModel";
import Message from "../entities/message";
import Reports from "../entities/reports";
import ReportModel from "../frameworks/models/reportModel";

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

  async createConversation(
    member1: string,
    member2: string
  ): Promise<Conversation | null> {
    try {
      const newConversation = new conversationModel({
        members: [
          { userId: new mongoose.Types.ObjectId(member1) },
          { userId: new mongoose.Types.ObjectId(member2) },
        ],
        isGroup: false,
      });

      const savedConversation = await newConversation.save();
      return savedConversation;
    } catch (error) {
      console.error("Error in createConversation:", error);
      throw error;
    }
  }

  async findConversation(
    senderId: string,
    receiverId: string
  ): Promise<Conversation | null> {
    try {
      const conversation = await conversationModel.findOne({
        members: {
          $all: [
            { $elemMatch: { userId: new mongoose.Types.ObjectId(senderId) } },
            { $elemMatch: { userId: new mongoose.Types.ObjectId(receiverId) } },
          ],
        },
        isGroup: false,
      });

      return conversation;
    } catch (error) {
      console.error("Error in findConversation:", error);
      throw error;
    }
  }

  async sendMessage(
    conversationId: mongoose.Types.ObjectId,
    senderId: string,
    content: string
  ): Promise<any> {
    try {
      const newMessage = new MessageModel({
        conversationId: new mongoose.Types.ObjectId(conversationId),
        sender: new mongoose.Types.ObjectId(senderId),
        content: content,
      });

      const savedMessage = await newMessage.save();

      await conversationModel.findByIdAndUpdate(conversationId, {
        $set: { updatedAt: new Date() },
      });

      return savedMessage;
    } catch (error) {
      console.error("Error in sendMessage:", error);
      throw error;
    }
  }

  async findMessages(
    conversationId: mongoose.Types.ObjectId | undefined
  ): Promise<Message[]> {
    try {
      if (conversationId) {
        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
          throw new Error("Invalid conversation ID");
        }
      }

      const messages = await MessageModel.find({
        conversationId: new mongoose.Types.ObjectId(conversationId),
      })
        .sort({ createdAt: 1 })
        .lean()
        .exec();

      return messages;
    } catch (error) {
      console.error("Error in findMessages:", error);
      throw error;
    }
  }

  async reportFriend(
    reporterUsername: string,
    reportedUsername: string,
    reporterId: string,
    reportedUserId: string,
    subject: string,
    reason: string
  ): Promise<Reports> {
    try {
      console.log(reportedUsername);

      const newReport = new ReportModel({
        reporterId: new mongoose.Types.ObjectId(reporterId),
        reportedUserId: new mongoose.Types.ObjectId(reportedUserId),
        reporterUser: reporterUsername,
        reportedUser: reportedUsername,
        subject,
        reason,
      });
      console.log(newReport);

      const savedReport = await newReport.save();
      return savedReport;
    } catch (error) {
      console.error("Error in reportFriend:", error);
      throw error;
    }
  }
}

export default FriendRepository;
