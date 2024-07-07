import User from "../../../entities/user";

interface AdminRepo {
  findAdmin(email: string): Promise<User | null>;
  getUsers(): Promise<{ users: {}[]; total: number }>;
}

export default AdminRepo;
