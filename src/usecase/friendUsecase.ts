import { Request, Response, NextFunction } from "express";
import FriendRepository from "../repository/friendRepository";
import UserNotifications from "../entities/userNotification";
import Friend from "../entities/friends";
import mongoose from "mongoose";

class FriendUseCase {
  private _friendRepository: FriendRepository;

  constructor(friendRepository: FriendRepository) {
    this._friendRepository = friendRepository;
  }

  async getGfriends(currentUserId: string, searchTerm?: string) {
    try {
      const friendsData = await this._friendRepository.getGfriends(
        currentUserId,
        searchTerm
      );

      if (friendsData) {
        return {
          status: 200,
          friendsData,
        };
      } else {
        return {
          status: 400,
          message: "Error getting Friends",
        };
      }
    } catch (error) {
      console.error(error);
      return { status: 500, message: "An error occurred" };
    }
  }

  async addFriend(userId: string, friendId: string) {
    try {
      if (!userId || !friendId) {
        return {
          status: 400,
          message: "User ID and Friend ID are required",
        };
      }

      const existingFriend = await this._friendRepository.findFriendRepo(
        userId
      );
      if (
        existingFriend &&
        existingFriend.friends.some(
          (friend) => friend.friendId.toString() === friendId
        )
      ) {
        return {
          status: 400,
          message: "Friend request already sent or Already Friend",
        };
      }

      const friendAdd = await this._friendRepository.saveFriend(
        userId,
        friendId
      );

      const user = await this._friendRepository.findById(userId);

      const notification: UserNotifications["notifications"][0] = {
        category: "friends",
        _id: new mongoose.Types.ObjectId(userId),
        message: `You have received a new friend request from ${user?.userName}`,
        profile: user?.profilePicture,
        type: "friendRequest",
        timestamp: new Date(),
      };
      await this._friendRepository.addNotification(friendId, notification);

      return {
        status: 200,
        message: "Friend Request Sent Successfully",
      };
    } catch (error) {
      console.error("Error in addFriend:", error);
      return {
        status: 500,
        message: "An Error Occurred",
      };
    }
  }

  async fetchFriends(userId: string) {
    try {
      const result = await this._friendRepository.fetchFriends(userId);

      if (!result) {
        return {
          status: 404,
          message: "Friends not found",
        };
      }
      return {
        status: 200,
        data: result,
      };
    } catch (error: any) {
      console.error("Error in fetchFriends use case:", error);
      return {
        status: 500,
        message: "Internal server error",
      };
    }
  }

  async getUsers(searchTerm?: string) {
    try {
      const users = await this._friendRepository.getAllUsers(searchTerm);

      return {
        status: 200,
        data: users,
      };
    } catch (error) {
      console.error("Error in getUsers use case:", error);
      return {
        status: 500,
        message: "Internal server error",
      };
    }
  }

  async removeFriend(userId: string, friendId: string) {
    try {
      const friendRemoved = await this._friendRepository.removeFriend(
        userId,
        friendId
      );
      if (friendRemoved) {
        return { status: 200, message: "Friend removed successfully" };
      }
      return { status: 400, message: "Failed to remove Friend" };
    } catch (error) {
      console.error("Error in getUsers use case:", error);
      return {
        status: 500,
        message: "Internal server error",
      };
    }
  }

  async acceptFriend(userId: string, friendId: string) {
    try {
      const friendAccepted = await this._friendRepository.acceptFriendRequest(
        userId,
        friendId
      );

      if (!friendAccepted) {
        return {
          status: 400,
          message: "Failed to accept friend request",
        };
      } else {
        const user = await this._friendRepository.findById(userId);

        const notification: UserNotifications["notifications"][0] = {
          category: "friends",
          _id: new mongoose.Types.ObjectId(userId),
          message: `${user?.userName} Accepted Your Friend request`,
          profile: user?.profilePicture,
          type: "",
          timestamp: new Date(),
        };
        await this._friendRepository.addNotification(friendId, notification);

        const conversation = await this._friendRepository.createConversation(
          userId,
          friendId
        );
      }
      return {
        status: 200,
        message: "Successfully added as friend",
      };
    } catch (error) {
      console.log("Error accepting friend request:", error);
      return {
        status: 500,
        message: "Internal server error",
      };
    }
  }

  async rejectFriend(userId: string, friendId: string) {
    try {
      const friendRejected = await this._friendRepository.rejectFriendRequest(
        userId,
        friendId
      );

      return {
        status: 200,
        message: "Successfully Rejected",
      };
    } catch (error) {
      console.log("Error rejecting friend request:", error);
      return {
        status: 500,
        message: "Internal server error",
      };
    }
  }

  async sendMessage(senderId: string, receiverId: string, content: string) {
    try {
      if (!senderId || !receiverId || !content) {
        return {
          status: 400,
          message: "Data Not Found",
        };
      }

      const conversation = await this._friendRepository.findConversation(
        senderId,
        receiverId
      );

      if (conversation) {
        const conversationId = new mongoose.Types.ObjectId(conversation._id);

        const message = await this._friendRepository.sendMessage(
          conversationId,
          senderId,
          content
        );

        if (message) {
          return {
            status: 200,
            message: "Message sent successfully",
          };
        }
      }
      return {
        status: 400,
        message: "Something went wrong",
      };
    } catch (error) {
      return {
        status: 500,
        message: "Internal server error",
      };
    }
  }

  async getMessages(member1: string, member2: string) {
    try {
      if (!member1 || !member2) {
        return {
          status: 400,
          message: "Data Not Found",
        };
      }

      const conversation = await this._friendRepository.findConversation(
        member1,
        member2
      );

      if (conversation) {
        const conversationId = conversation._id;

        const messages = await this._friendRepository.findMessages(
          conversationId
        );

        return {
          status: 200,
          data: messages,
        };
      }

      return {
        status: 400,
        message: "Something went wrong",
      };
    } catch (error) {
      return {
        status: 500,
        message: "Internal server error",
      };
    }
  }

  async reportUser(
    reporterId: string,
    reportedUserId: string,
    subject: string,
    reason: string
  ) {
    try {
      const reporter = await this._friendRepository.findById(reporterId);
      const reportedUser = await this._friendRepository.findById(
        reportedUserId
      );

      if (!reporter || !reportedUser) {
        return {
          status: 400,
          message: "User not Found",
        };
      }
      const reporterUsername = reporter?.userName;
      const reportedUsername = reportedUser?.userName;

      const report = await this._friendRepository.reportFriend(
        reporterUsername,
        reportedUsername,
        reporterId,
        reportedUserId,
        subject,
        reason
      );

      if (report) {
        return {
          status: 200,
          message: "Successfully reported user",
        };
      }
      return {
        status: 400,
        message: "Something went wrong",
      };
    } catch (error) {
      return {
        status: 500,
        message: "Internal server error",
      };
    }
  }
}

export default FriendUseCase;
