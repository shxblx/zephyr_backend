import User from "../../../entities/user";

interface UserRepo {
  findByEmail(email: string): Promise<User | null>;
  findUserName(userName: string): Promise<User | null>
  saveUser(user: User): Promise<User | null>;
  saveOtp(
    email: string,
    otp: string,
    userName: string,
    displayName: string,
    password: string
  ): Promise<any>;
  findOtpByEmail(email: string): Promise<any>;
  deleteOtpByEmail(email: string): Promise<any>;
  findById(id: string): Promise<User | null>;
  updateUser(user: User): Promise<User | null>;
}

export default UserRepo;
