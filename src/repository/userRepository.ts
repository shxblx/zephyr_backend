import Otp from "../entities/otp";
import User from "../entities/user";
import OtpModel from "../frameworks/models/otpModel";
import UserModel from "../frameworks/models/userModel";
import UserRepo from "../usecase/interfaces/user/IuserRepo";

class UserRepository implements UserRepo {
  async findByEmail(email: string): Promise<User | null> {
    const userData = await UserModel.findOne({ email: email });
    return userData;
  }

  async findUserName(userName: string): Promise<User | null> {
    const userData = await UserModel.findOne({ userName: userName })
    return userData
  }

  async saveUser(user: User): Promise<User> {
    const newUser = new UserModel(user);
    const savedUser = await newUser.save();
    return savedUser;
  }

  async saveOtp(
    email: string,
    otp: string,
    userName?: string,
    displayName?: string,
    password?: string
  ): Promise<any> {
    const filter = { email };
    const update: any = {
      email,
      otp,
      otpGeneratedAt: new Date(),
      ...(userName && { userName }),
      ...(displayName && { displayName }),
      ...(password && { password }),
    };

    const options = {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    };

    try {
      const savedOtp = await OtpModel.findOneAndUpdate(
        filter,
        update,
        options
      ).exec();
      return savedOtp;
    } catch (error) {
      throw new Error("Failed to save OTP.");
    }
  }

  async findOtpByEmail(email: string): Promise<any> {
    return OtpModel.findOne({ email });
  }

  async deleteOtpByEmail(email: string): Promise<any> {
    return OtpModel.deleteOne({ email });
  }

  async findById(id: string): Promise<User | null> {
    return UserModel.findById(id).lean().exec()
  }

  async updateUser(user: User): Promise<User | null> {
    const { _id, ...updateData } = user;
    return UserModel.findOneAndUpdate(
      { _id: user._id },
      updateData,
      { new: true }
    ).exec();
  }
}

export default UserRepository;
