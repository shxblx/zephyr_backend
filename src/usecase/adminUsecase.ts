import EncryptPassword from "../frameworks/utils/bcryptPassword";
import JWTToken from "../frameworks/utils/generateToken";
import AdminRepository from "../repository/adminRepository";

class AdminUsecase {
  private AdminRepository: AdminRepository;
  private encryptPassword: EncryptPassword;
  private jwtToken: JWTToken;

  constructor(
    AdminRepository: AdminRepository,
    encryptPassword: EncryptPassword,
    jwtToken: JWTToken
  ) {
    this.AdminRepository = AdminRepository;
    this.encryptPassword = encryptPassword;
    this.jwtToken = jwtToken;
  }

  async verifyAdmin(email: string, password: string) {
    const adminData = await this.AdminRepository.findAdmin(email);

    if (!adminData || adminData.isAdmin === false) {
      return {
        status: 400,
        data: {
          isAdmin: false,
          message: "Authorization Denied",
        },
      };
    }
    const passwordMatch = await this.encryptPassword.compare(
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
    const token = this.jwtToken.generateToken(adminData._id, "admin");
    return {
      status: 200,
      isAdmin: true,
      token,
    };
  }

  async getUserData() {
    const usersData = await this.AdminRepository.getUsers();

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
