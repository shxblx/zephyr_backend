import User from "../entities/user";
import UserModel from "../frameworks/models/userModel";
import AdminRepo from "../usecase/interfaces/admin/IadminRepo";

class AdminRepository implements AdminRepo {
  async findAdmin(email: string): Promise<User | null> {
    const adminData = await UserModel.findOne({ email });
    return adminData;
  }
}

export default AdminRepository;
