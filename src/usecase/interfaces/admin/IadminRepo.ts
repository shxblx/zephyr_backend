import Community from "../../../entities/community";
import User from "../../../entities/user";

interface AdminRepo {
  findAdmin(email: string): Promise<User | null>;
  getUsers(): Promise<{ users: {}[]; total: number }>;
  fetchCommunities(): Promise<Community[] | null>
}

export default AdminRepo;
