import { Request, Response, NextFunction } from "express";
import FriendRepository from "../repository/friendRepository";
import Friend from "../entities/friends";
import mongoose from "mongoose";

class FriendUseCase {
    private _friendRepository: FriendRepository;

    constructor(friendRepository: FriendRepository) {
        this._friendRepository = friendRepository;
    }

    async getGfriends(currentUserId: string, searchTerm?: string) {
        try {
            const friendsData = await this._friendRepository.getGfriends(currentUserId, searchTerm);
            console.log(friendsData);


            if (friendsData) {
                return {
                    status: 200,
                    friendsData
                }
            } else {
                return {
                    status: 400,
                    message: "Error getting Friends"
                }
            }
        } catch (error) {
            console.error(error);
            return { status: 500, message: "An error occurred" }
        }
    }

    async addFriend(userId: string, friendId: string) {
        try {
            if (!userId || !friendId) {
                return {
                    status: 400,
                    message: "User/Friend Not Found"
                };
            }

            const friend = await this._friendRepository.findFriendRepo(userId);
            if (friend) {
                const updatedFriend = await this._friendRepository.addFriendToExisting(userId, friendId);
                if (!updatedFriend) {
                    return {
                        status: 400,
                        message: "Friend already added"
                    };
                }
            } else {
                const friendData: Friend = {
                    userId: userId,
                    friends: [{
                        friendId: new mongoose.Types.ObjectId(friendId),
                        createdAt: new Date()
                    }]
                };

                const savedFriend = await this._friendRepository.saveFriend(friendData);
                if (!savedFriend) {
                    return {
                        status: 400,
                        message: "Error while saving new friend document"
                    };
                }
            }

            return {
                status: 200,
                message: "Friend added successfully"
            };

        } catch (error) {
            console.error("Error in addFriend:", error);
            return {
                status: 500,
                message: "Internal server error"
            };
        }
    }

    async fetchFriends(userId: string) {
        try {
            const result = await this._friendRepository.fetchFriends(userId);
            if (!result) {
                return {
                    status: 404,
                    message: "Friends not found"
                };
            }
            return {
                status: 200,
                data: result
            };
        } catch (error: any) {
            console.error("Error in fetchFriends use case:", error);
            return {
                status: 500,
                message: "Internal server error"
            };
        }
    }

    async getUsers(searchTerm?: string) {
        try {

            const users = await this._friendRepository.getAllUsers(searchTerm);
            console.log(users);

            return {
                status: 200,
                data: users
            };
        } catch (error) {
            console.error("Error in getUsers use case:", error);
            return {
                status: 500,
                message: "Internal server error"
            };
        }
    }

}

export default FriendUseCase;
