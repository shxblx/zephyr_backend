import Otp from "../entities/otp";
import User from "../entities/user";
import OtpModel from "../frameworks/models/otpModel";
import UserModel from "../frameworks/models/userModel";
import UserRepo from "../usecase/interfaces/IuserRepo";

class UserRepository implements UserRepo {
  async findByEmail(email: string): Promise<User | null> {
    const userData = await UserModel.findOne({ email: email });
    return userData;
  }

  async saveUser(user: User): Promise<User> {
    const newUser = new UserModel(user);
    const savedUser = await newUser.save();

    return savedUser;
  }

  async saveOtp(email: string, otp: string): Promise<any> {
    const otpData = new OtpModel({
      email,
      otp,
      otpGeneratedAt: new Date(),
    });

    const savedOtp = await otpData.save();

    return savedOtp;
  }
}

export default UserRepository;
