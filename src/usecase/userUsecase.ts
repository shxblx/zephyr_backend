import EncryptPassword from "../frameworks/utils/bcryptPassword";
import GenerateOtp from "../frameworks/utils/generateOtp";
import UserRepository from "../repository/userRepository";

class UserUsecase {
  private UserRepository: UserRepository;
  private generateOtp: GenerateOtp;
  private EncryptPassword: EncryptPassword;

  constructor(
    UserRepository: UserRepository,
    generateOtp: GenerateOtp,
    encryptPassword: EncryptPassword
  ) {
    this.UserRepository = UserRepository;
    this.generateOtp = generateOtp;
    this.EncryptPassword = encryptPassword;
  }

  async checkExist(email: string) {
    const userExist = await this.UserRepository.findByEmail(email);
    if (userExist) {
      return {
        status: 400,
        data: {
          status: false,
          message: "User already exist",
        },
      };
    } else {
      return {
        status: 200,
        data: {
          status: true,
          message: "User does not exist",
        },
      };
    }
  }

  async signup(
    email: string,
    userName: string,
    displayName: string,
    password: string
  ) {
    const otp = this.generateOtp.createOtp();
    const user={
      email,userName,displayName,password
    }
    
  }
}

export default UserUsecase;
