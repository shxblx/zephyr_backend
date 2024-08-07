import Community from "../entities/community";
import CommunityReports from "../entities/communityReport";
import Reports from "../entities/reports";
import User from "../entities/user";
import CommunityModel from "../frameworks/models/communityModel";
import CommunityReportsModel from "../frameworks/models/communityReportModel";
import ReportModel from "../frameworks/models/reportModel";
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
    const userData = await UserModel.findOne({ _id: userId });
    return userData;
  }

  async saveUser(user: User): Promise<User> {
    const newUser = new UserModel(user);
    const savedUser = await newUser.save();
    return savedUser;
  }

  async fetchCommunities(): Promise<Community[] | null> {
    try {
      const communities = await CommunityModel.find().lean();
      return communities;
    } catch (error) {
      console.error("Error in fetchCommunitiesUserNotIn:", error);
      throw error;
    }
  }

  async findCommunityById(communityId: string): Promise<Community | null> {
    try {
      const community = await CommunityModel.findById(communityId).lean();
      return community;
    } catch (error) {
      console.error("Error finding community by ID:", error);
      throw error;
    }
  }

  async saveCommunity(community: Community): Promise<Community | null> {
    try {
      const updatedCommunity = await CommunityModel.findByIdAndUpdate(
        community._id,
        community,
        { new: true, runValidators: true }
      ).lean();

      if (!updatedCommunity) {
        console.error("Community not found or update failed");
        return null;
      }

      return updatedCommunity as Community;
    } catch (error) {
      console.error("Error saving community:", error);
      throw error;
    }
  }

  async fetchReports(): Promise<Reports[]> {
    try {
      const reports = await ReportModel.find().lean();
      return reports;
    } catch (error) {
      console.error("Error in fetchReports:", error);
      throw error;
    }
  }
  async fetchCommunityReports(): Promise<CommunityReports[]> {
    try {
      const reports = await CommunityReportsModel.find().lean();
      return reports;
    } catch (error) {
      console.error("Error in fetchReports:", error);
      throw error;
    }
  }
}

export default AdminRepository;
