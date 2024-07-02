import User from "../../entities/user";

interface UserRepo {
  findByEmail(email: string): Promise<User | null>;
  saveUser(user: User): Promise<User | null>;
  saveOtp(email: string, otp: string): Promise<any>;
}

export default UserRepo;
