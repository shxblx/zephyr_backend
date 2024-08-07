import Community from "../../../entities/community";
import CommunityMembers from "../../../entities/communityMembers";
import User from "../../../entities/user";

interface CommunityRepo {
  createCommunity(communityData: Community): Promise<Community>;
  createCommunityMembers(
    communityMembersData: CommunityMembers
  ): Promise<CommunityMembers>;
  fetchCommunitiesUserNotIn(userId: string): Promise<Community[]>;
  addMemberToCommunity(
    communityId: string,
    userId: string
  ): Promise<CommunityMembers>;
  fetchMyCommunities(userId: string): Promise<Community[]>;
  leaveCommunity(
    userId: string,
    communityId: string
  ): Promise<CommunityMembers>;
  getCommunityMembers(
    communityId: string
  ): Promise<{ members: User[]; admin: User }>;
  removeMember(
    userId: string,
    communityId: string
  ): Promise<CommunityMembers | null>;
}

export default CommunityRepo;
