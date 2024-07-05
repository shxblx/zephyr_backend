import User from "../../../entities/user";

interface AdminRepo {
  findAdmin(email: string): Promise<User | null>;
}

export default AdminRepo;
