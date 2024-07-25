import Community from "../../../entities/community"
import CommunityMembers from "../../../entities/communityMembers"

interface CommunityRepo {
    createCommunity(communityData: Community): Promise<Community>
    createCommunityMembers(communityMembersData: CommunityMembers): Promise<CommunityMembers>
    fetchCommunitiesUserNotIn(userId: string): Promise<Community[]>
    addMemberToCommunity(communityId: string, userId: string): Promise<CommunityMembers>
    fetchMyCommunities(userId: string): Promise<Community[]>
    leaveCommunity(userId: string, communityId: string): Promise<CommunityMembers>
}

export default CommunityRepo