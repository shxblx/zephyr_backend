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
    const usersData = await this._adminRepository.getUsers();

    if (usersData) {
      return {
        status: 200,
        data: usersData.users,
        total: usersData.total,
      };
    }else{
      return{
        status:400,
        message:"Failed to retrieve data"
      }
    }
  }
}

export default AdminUsecase;
