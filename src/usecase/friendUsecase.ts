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
      }
      return {
        status: 200,
        message: "Successfully added as friend",
      };
    } catch (error) {
      console.log("Error accepting friend request:", error);
      throw error;
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
      throw error;
    }
  }
}

export default FriendUseCase;
