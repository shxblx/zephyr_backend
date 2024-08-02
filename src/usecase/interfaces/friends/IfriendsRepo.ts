import Friend from "../../../entities/friends";
import User from "../../../entities/user";

interface FriendRepo {
  getGfriends(currentUserId: string): Promise<{ users: {}[] }>;
  findById(id: string): Promise<User | null>;
  findFriendRepo(id: string): Promise<Friend | null>;
  saveFriend(userId: string, friendId: string): Promise<Friend | null>;
  fetchFriends(userId: string): Promise<Friend | null>;
  getAllUsers(searchTerm?: string): Promise<{ users: {}[] }>;
  addNotification(userId: string, notification: any): Promise<void>;
  acceptFriendRequest(userId: string, friendId: string): Promise<Friend | null>;
}

export default FriendRepo;
