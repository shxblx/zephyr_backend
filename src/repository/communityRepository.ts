import mongoose from "mongoose";
import Community from "../entities/community";
import CommunityMembers from "../entities/communityMembers";
import CommunityMemberModel from "../frameworks/models/CommunityMembers";
import CommunityModel from "../frameworks/models/communityModel";
import CommunityRepo from "../usecase/interfaces/community/IcommunityRepo";
import User from "../entities/user";
import CommunityMessage from "../entities/communityMessage";
import CommunityMessageModel from "../frameworks/models/communityMessageModel";
import UserModel from "../frameworks/models/userModel";
import CommunityReports from "../entities/communityReport";
import CommunityReportsModel from "../frameworks/models/communityReportModel";

class CommunityRepository implements CommunityRepo {
  async createCommunity(communityData: Community): Promise<any> {
    const newCommunity = new CommunityModel(communityData);
    return await newCommunity.save();
  }

  async createCommunityMembers(
    communityMembersData: CommunityMembers
  ): Promise<any> {
    const newCommunityMembers = new CommunityMemberModel(communityMembersData);
    return await newCommunityMembers.save();
  }

  async fetchCommunitiesUserNotIn(
    userId: string,
    search?: string
  ): Promise<Community[]> {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);

      const userCommunities = await CommunityMemberModel.find({
        $or: [
          { "members.userId": userObjectId },
          { "admin.userId": userObjectId },
        ],
      }).distinct("communityId");

      let query: any = {
        _id: { $nin: userCommunities },
        isBanned: { $ne: true },
      };

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { hashtags: { $in: [new RegExp(search, "i")] } },
        ];
      }

      const communities = await CommunityModel.find(query).lean();

      return communities;
    } catch (error) {
      console.error("Error in fetchCommunitiesUserNotIn:", error);
      throw error;
    }
  }

  async addMemberToCommunity(
    communityId: string,
    userId: string
  ): Promise<any> {
    try {
      const result = await CommunityMemberModel.findOneAndUpdate(
        { communityId: new mongoose.Types.ObjectId(communityId) },
        {
          $addToSet: {
            members: {
              userId: new mongoose.Types.ObjectId(userId),
              joinedAt: new Date(),
            },
          },
        },
        { new: true, upsert: true }
      );
      return result;
    } catch (error) {
      console.error("Error in addMemberToCommunity:", error);
      throw error;
    }
  }

  async isUserInCommunity(
    communityId: string,
    userId: string
  ): Promise<boolean> {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const communityObjectId = new mongoose.Types.ObjectId(communityId);

      const communityMember = await CommunityMemberModel.findOne({
        communityId: communityObjectId,
        $or: [
          { "members.userId": userObjectId },
          { "admin.userId": userObjectId },
        ],
      });

      return !!communityMember;
    } catch (error) {
      console.error("Error in isUserInCommunity:", error);
      throw error;
    }
  }

  async fetchMyCommunities(userId: string): Promise<Community[]> {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);

      const communityMembers = await CommunityMemberModel.find({
        $or: [
          { "members.userId": userObjectId },
          { "admin.userId": userObjectId },
        ],
      }).distinct("communityId");

      const communities = await CommunityModel.find({
        _id: { $in: communityMembers },
        isBanned: { $ne: true },
      }).lean();

      return communities;
    } catch (error) {
      console.error("Error in fetchMyCommunities:", error);
      throw error;
    }
  }

  async leaveCommunity(userId: string, communityId: string): Promise<any> {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const communityObjectId = new mongoose.Types.ObjectId(communityId);

      const community = await CommunityMemberModel.findOne({
        communityId: communityObjectId,
      });

      if (!community) {
        throw new Error("Community not found");
      }

      if (community.admin.userId.equals(userObjectId)) {
        const newAdmin = community.members[0]?.userId;
        if (newAdmin) {
          community.admin.userId = newAdmin;
          await community.save();
        } else {
          throw new Error("No users left to assign as new admin");
        }
      }

      const result = await CommunityMemberModel.findOneAndUpdate(
        { communityId: communityObjectId },
        {
          $pull: {
            members: { userId: userObjectId },
          },
        },
        { new: true }
      );

      if (!result) {
        throw new Error("User was not removed from the community");
      }

      const userRemoved = result.members.every(
        (member) => !member.userId.equals(userObjectId)
      );
      if (!userRemoved) {
        throw new Error("Failed to remove user from the community");
      }

      return result;
    } catch (error) {
      console.error("Error in leaveCommunity:", error);
      throw error;
    }
  }

  async getCommunityMembers(
    communityId: string
  ): Promise<{ members: User[]; admin: User; memberCount: number }> {
    try {
      const communityMembers = await CommunityMemberModel.findOne({
        communityId,
      })
        .populate<{ members: { userId: User }[]; admin: { userId: User } }>(
          "members.userId admin.userId"
        )
        .exec();

      if (!communityMembers) {
        throw new Error("Community not found");
      }

      const members = communityMembers.members.map((member) => member.userId);
      const admin = communityMembers.admin.userId;
      const memberCount = members.length + 1;

      return { members, admin, memberCount };
    } catch (error: any) {
      throw new Error(`Error fetching community members: ${error.message}`);
    }
  }

  async getCommunityById(communityId: string): Promise<Community | null> {
    try {
      const community = await CommunityModel.findOne({ _id: communityId });
      return community;
    } catch (error: any) {
      throw new Error(`Error fetching community members: ${error.message}`);
    }
  }

  async removeMember(
    userId: string,
    communityId: string
  ): Promise<CommunityMembers | null> {
    try {
      const removedMember = await CommunityMemberModel.findOneAndUpdate(
        { communityId: communityId },
        {
          $pull: {
            members: { userId: new mongoose.Types.ObjectId(userId) },
          },
        },
        { new: true }
      )
        .lean()
        .exec();
      return removedMember;
    } catch (error: any) {
      throw new Error(`Error fetching community members: ${error.message}`);
    }
  }

  async sendCommunityMessage(
    communityId: string,
    sender: string,
    userName: string,
    profilePicture: string,
    content: string
  ): Promise<CommunityMessage> {
    try {
      const newMessage = new CommunityMessageModel({
        communityId: new mongoose.Types.ObjectId(communityId),
        sender: new mongoose.Types.ObjectId(sender),
        userName,
        profilePicture,
        content,
      });

      const savedMessage = await newMessage.save();
      return savedMessage;
    } catch (error) {
      console.error("Error in sendCommunityMessage:", error);
      throw error;
    }
  }

  async getCommunityMessages(communityId: string): Promise<CommunityMessage[]> {
    try {
      const messages = await CommunityMessageModel.find({ communityId })
        .sort({ createdAt: 1 })
        .lean()
        .exec();
      return messages;
    } catch (error) {
      console.error("Error in getCommunityMessages:", error);
      throw error;
    }
  }

  async updateCommunity(
    name: string,
    description: string,
    tags: string[],
    communityId: string
  ): Promise<Community | null> {
    try {
      const updatedCommunity = await CommunityModel.findByIdAndUpdate(
        communityId,
        {
          $set: {
            name: name,
            description: description,
            hashtags: tags,
          },
        },
        { new: true, runValidators: true }
      ).lean();

      return updatedCommunity;
    } catch (error) {
      console.error("Error in updateCommunity repository:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    return UserModel.findById(id).lean().exec();
  }

  async reportCommunity(
    reporterUsername: string,
    reportedCommunityName: string,
    reporterId: string,
    reportedUserId: string,
    subject: string,
    reason: string
  ): Promise<CommunityReports> {
    try {
      const newReport = new CommunityReportsModel({
        reporterId: new mongoose.Types.ObjectId(reporterId),
        reportedCommunityId: new mongoose.Types.ObjectId(reportedUserId),
        reporterUser: reporterUsername,
        reportedCommunity: reportedCommunityName,
        subject,
        reason,
      });

      const savedReport = await newReport.save();
      return savedReport;
    } catch (error) {
      console.error("Error in reportFriend:", error);
      throw error;
    }
  }

  async makeAdmin(userId: string, communityId: string): Promise<boolean> {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const communityObjectId = new mongoose.Types.ObjectId(communityId);

      const currentCommunity = await CommunityMemberModel.findOne({
        communityId: communityObjectId,
      });

      if (!currentCommunity) {
        throw new Error("Community not found");
      }

      const currentAdminId = currentCommunity.admin.userId;

      await CommunityMemberModel.updateOne(
        { communityId: communityObjectId },
        { $pull: { members: { userId: userObjectId } } }
      );

      const result = await CommunityMemberModel.findOneAndUpdate(
        { communityId: communityObjectId },
        {
          $set: { "admin.userId": userObjectId },
          $addToSet: {
            members: {
              userId: currentAdminId,
              joinedAt: new Date(),
            },
          },
        },
        { new: true }
      );

      if (!result) {
        throw new Error("Failed to update community");
      }

      return true;
    } catch (error) {
      console.error("Error in makeAdmin:", error);
      throw error;
    }
  }
}

export default CommunityRepository;
