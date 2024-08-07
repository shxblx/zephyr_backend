import EncryptPassword from "../frameworks/utils/bcryptPassword";
import JWTToken from "../frameworks/utils/generateToken";
import AdminRepository from "../repository/adminRepository";

class AdminUsecase {
  private _adminRepository: AdminRepository;
  private _encryptPassword: EncryptPassword;
  private _jwtToken: JWTToken;

  constructor(
    AdminRepository: AdminRepository,
    encryptPassword: EncryptPassword,
    jwtToken: JWTToken
  ) {
    this._adminRepository = AdminRepository;
    this._encryptPassword = encryptPassword;
    this._jwtToken = jwtToken;
  }

  async verifyAdmin(email: string, password: string) {
    const adminData = await this._adminRepository.findAdmin(email);

    if (!adminData || adminData.isAdmin === false) {
      return {
        status: 400,
        data: {
          isAdmin: false,
          message: "Authorization Denied",
        },
      };
    }
    const passwordMatch = await this._encryptPassword.compare(
      password,
      adminData?.password
    );

    if (!passwordMatch) {
      return {
        status: 400,
        data: {
          passwordMatch,
          message: "Password mismatch",
        },
      };
    }
    const token = this._jwtToken.generateToken(adminData._id, "admin");
    return {
      status: 200,
      isAdmin: true,
      token,
    };
  }

  async getUserData() {
    try {
      const usersData = await this._adminRepository.getUsers();

      if (usersData) {
        return {
          status: 200,
          data: usersData.users,
          total: usersData.total,
        };
      } else {
        return {
          status: 400,
          message: "Failed to retrieve data",
        };
      }
    } catch (error) {
      return {
        status: 500,
        message: "An error Occured",
      };
      console.log(error);
    }
  }

  async blockUser(userId: string) {
    try {
      const user = await this._adminRepository.findById(userId);
      if (user) {
        user.isBlocked = true;
        await this._adminRepository.saveUser(user);
        return {
          status: 200,
        };
      } else {
        return {
          status: 404,
        };
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      return {
        status: 500,
      };
    }
  }

  async unblockUser(userId: string) {
    try {
      const user = await this._adminRepository.findById(userId);
      if (user) {
        user.isBlocked = false;
        await this._adminRepository.saveUser(user);
        return {
          status: 200,
        };
      } else {
        return {
          status: 404,
        };
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      return {
        status: 500,
      };
    }
  }

  async getCommunities() {
    try {
      const communities = await this._adminRepository.fetchCommunities();
      if (!communities) {
        return { status: 400, message: "No Communities Found" };
      }
      return { status: 200, communities };
    } catch (error) {
      throw error;
    }
  }

  async banCommunity(communityId: string) {
    try {
      const community = await this._adminRepository.findCommunityById(
        communityId
      );
      if (community) {
        community.isBanned = true;
        const updatedCommunity = await this._adminRepository.saveCommunity(
          community
        );
        if (updatedCommunity) {
          return { status: 200 };
        } else {
          return { status: 500, message: "Failed to update community" };
        }
      } else {
        return { status: 404, message: "Community not found" };
      }
    } catch (error) {
      console.error("Error banning community:", error);
      return { status: 500, message: "Internal Server Error" };
    }
  }

  async unbanCommunity(communityId: string) {
    try {
      const community = await this._adminRepository.findCommunityById(
        communityId
      );
      if (community) {
        community.isBanned = false;
        const updatedCommunity = await this._adminRepository.saveCommunity(
          community
        );
        if (updatedCommunity) {
          return { status: 200 };
        } else {
          return { status: 500, message: "Failed to update community" };
        }
      } else {
        return { status: 404, message: "Community not found" };
      }
    } catch (error) {
      console.error("Error unbanning community:", error);
      return { status: 500, message: "Internal Server Error" };
    }
  }

  async getUserInfo(userId: string) {
    try {
      if (!userId) {
        return {
          status: 400,
          message: "Data not Found",
        };
      }

      const user = await this._adminRepository.findById(userId);

      if (user) {
        return {
          status: 200,
          data: user,
        };
      }
      return {
        status: 400,
        message: "Something went wrong",
      };
    } catch (error) {
      return {
        status: 500,
        message: "Internel Server error",
      };
    }
  }

  async getReports() {
    try {
      const reports = await this._adminRepository.fetchReports();

      if (reports) {
        return {
          status: 200,
          data: reports,
        };
      }
      return {
        status: 400,
        message: "Something went wrong",
      };
    } catch (error) {   return {
      status: 500,
      message: "Internel Server error",
    };}
  }
}

export default AdminUsecase;
