import EncryptOtp from "../frameworks/utils/bcryptOtp";
import EncryptPassword from "../frameworks/utils/bcryptPassword";
import GenerateOtp from "../frameworks/utils/generateOtp";
import sendOtp from "../frameworks/utils/sendMail";
import UserRepository from "../repository/userRepository";

class UserUsecase {
  private UserRepository: UserRepository;
  private generateOtp: GenerateOtp;
  private EncryptPassword: EncryptPassword;
  private EncryptOtp: EncryptOtp;
  private GenerateMail: sendOtp;

  constructor(
    UserRepository: UserRepository,
    generateOtp: GenerateOtp,
    encryptPassword: EncryptPassword,
    encryptOtp: EncryptOtp,
    generateMail: sendOtp
  ) {
    this.UserRepository = UserRepository;
    this.generateOtp = generateOtp;
    this.EncryptPassword = encryptPassword;
    this.EncryptOtp = encryptOtp;
    this.GenerateMail = generateMail;
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
    const user = {
      email,
      userName,
      displayName,
      password,
    };
    const hashedOtp = await this.EncryptOtp.encrypt(otp);

    await this.UserRepository.saveOtp(email, hashedOtp);

    this.GenerateMail.sendMail(email, otp);

    return {
      status: 200,
      data: {
        status: true,
        message: "Verification otp sent to your email",
      },
    };
  }
}

export default UserUsecase;
