import mongoose from "mongoose";
import Community from "../entities/community";
import CommunityMembers from "../entities/communityMembers";
import CommunityMemberModel from "../frameworks/models/CommunityMembers";
import CommunityModel from "../frameworks/models/communityModel";
import CommunityRepo from "../usecase/interfaces/community/IcommunityRepo";
import User from "../entities/user";

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
  ): Promise<{ members: User[]; admin: User }> {
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

      return { members, admin };
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
}

export default CommunityRepository;
