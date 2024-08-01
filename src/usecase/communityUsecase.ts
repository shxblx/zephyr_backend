import CommunityRepository from "../repository/communityRepository";
import cloudinary from '../frameworks/utils/cloudinaryConfig';
import mongoose from "mongoose";

class CommunityUsecase {
    private _communityRepository: CommunityRepository;

    constructor(communityRepository: CommunityRepository) {
        this._communityRepository = communityRepository;
    }

    async createCommunity(
        name: string,
        description: string,
        hashtags: string[],
        isPrivate: boolean,
        selectedUsers: string | string[],
        adminId: string,
        profile: Express.Multer.File
    ): Promise<{ status: number; message: string }> {
        try {
            let profilePictureUrl = '';
            if (profile) {
                const base64File = profile.buffer.toString('base64');
                const dataURI = `data:${profile.mimetype};base64,${base64File}`;
                const uploadResult = await cloudinary.uploader.upload(dataURI, {
                    resource_type: 'auto',
                });
                profilePictureUrl = uploadResult.secure_url;
            }

            const communityData = {
                name,
                description,
                hashtags,
                isPrivate,
                profilePicture: profilePictureUrl,
                createdBy: new mongoose.Types.ObjectId(adminId),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const newCommunity = await this._communityRepository.createCommunity(communityData);

            const userArray = Array.isArray(selectedUsers) ? selectedUsers : [selectedUsers].filter(Boolean);

            const communityMembersData = {
                communityId: new mongoose.Types.ObjectId(newCommunity._id),
                members: userArray.map((userId) => ({
                    userId: new mongoose.Types.ObjectId(userId),
                    joinedAt: new Date(),
                })),
                admin: {
                    userId: new mongoose.Types.ObjectId(adminId),
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            await this._communityRepository.createCommunityMembers(communityMembersData);

            return {
                status: 200,
                message: "Community successfully created",
            };
        } catch (error) {
            console.error(error);
            throw new Error('Failed to create community');
        }
    }

    async getCommunities(userId: string, search?: string) {
        try {
          const communities = await this._communityRepository.fetchCommunitiesUserNotIn(userId, search);
          
          return communities;
        } catch (error) {
          throw error;
        }
      }

    async joinCommunity(userId: string, communityId: string) {
        try {
            const isUserAlreadyInCommunity = await this._communityRepository.isUserInCommunity(communityId, userId);

            if (isUserAlreadyInCommunity) {
                return {
                    status: 400,
                    message: "User is already a member of this community"
                };
            }

            await this._communityRepository.addMemberToCommunity(communityId, userId);

            return {
                status: 200,
                message: "Join success"
            };
        } catch (error) {
            console.error("Error in joinCommunity use case:", error);
            throw error;
        }
    }

    async fetchMyCommunities(userId: string) {
        try {
            const myCommunities = await this._communityRepository.fetchMyCommunities(userId);
            if (!myCommunities) {
                return {
                    status: 200,
                    message: "No Communities Found"
                }
            }
            return { status: 200, data: { myCommunities } }
        } catch (error) {
            console.error("Error in fetchMyCommunities use case:", error);
            throw error;
        }
    }

    async leaveCommunity(userId: string, communityId: string) {
        try {
            const result = await this._communityRepository.leaveCommunity(userId, communityId);

            if (!result) {
                return { status: 400, message: "Failed to leave from the community" };

            }

            return { status: 200, message: "Successfully left the community" };
        } catch (error) {
            return {
                status: 500,
                message: "Internal server error"
            };
        }
    }

    async getCommunityMembers(communityId: string) {
        try {
            const members = await this._communityRepository.getCommunityMembers(communityId);
            return { status: 200, data: members };
        } catch (error: any) {
            return { status: 500, message: error.message };
        }
    }

}

export default CommunityUsecase;
