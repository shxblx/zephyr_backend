import Friend from "../../../entities/friends";
import User from "../../../entities/user";

interface FriendRepo {
    getGfriends(currentUserId: string): Promise<{ users: {}[]; }>;
    findById(id: string): Promise<User | null>;
    saveUser(user: User): Promise<User | null>;
    findFriendRepo(id: string): Promise<Friend | null>;
    saveFriend(friend: Friend): Promise<Friend | null>;
    addFriendToExisting(userId: string, friendId: string): Promise<Friend | null>;
    fetchFriends(userId: string): Promise<Friend | null>;
    getAllUsers(searchTerm?: string): Promise<{ users: {}[]; }>
}

export default FriendRepo;