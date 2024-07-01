import User from "../../entities/user";

interface UserRepo {
  findByEmail(email: string): Promise<User | null>;
  saveUser(user: User): Promise<User | null>;
}

export default UserRepo;
