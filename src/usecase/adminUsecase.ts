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
          message: "Failed to retrieve data"
        }
      }
    } catch (error) {
      return {
        status: 500,
        message: "An error Occured"
      }
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
      const user = await this._adminRepository.findById(userId)
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

}

export default AdminUsecase;
