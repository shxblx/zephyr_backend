import User from "../entities/user";
import UserModel from "../frameworks/models/userModel";
import AdminRepo from "../usecase/interfaces/admin/IadminRepo";

class AdminRepository implements AdminRepo {
  async findAdmin(email: string): Promise<User | null> {
    const adminData = await UserModel.findOne({ email }).exec();
    return adminData as User | null;
  }

  async getUsers(): Promise<{ users: {}[]; total: number }> {
    const users = await UserModel.find().lean();
    const total = await UserModel.countDocuments();
    return { users, total };
  }

  async findById(userId: string): Promise<User | null> {
    const userData = await UserModel.findOne({ _id: userId })
    return userData
  }

  async saveUser(user: User): Promise<User> {
    const newUser = new UserModel(user);
    const savedUser = await newUser.save();
    return savedUser;
  }
}

export default AdminRepository;
