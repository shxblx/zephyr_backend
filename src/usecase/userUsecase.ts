import EncryptOtp from "../frameworks/utils/bcryptOtp";
import EncryptPassword from "../frameworks/utils/bcryptPassword";
import GenerateOtp from "../frameworks/utils/generateOtp";
import JWTToken from "../frameworks/utils/generateToken";
import sendOtp from "../frameworks/utils/sendMail";
import UserRepository from "../repository/userRepository";

class UserUsecase {
  private UserRepository: UserRepository;
  private generateOtp: GenerateOtp;
  private EncryptPassword: EncryptPassword;
  private EncryptOtp: EncryptOtp;
  private GenerateMail: sendOtp;
  private JwtToken: JWTToken;

  constructor(
    UserRepository: UserRepository,
    generateOtp: GenerateOtp,
    encryptPassword: EncryptPassword,
    encryptOtp: EncryptOtp,
    generateMail: sendOtp,
    jwtToken: JWTToken
  ) {
    this.UserRepository = UserRepository;
    this.generateOtp = generateOtp;
    this.EncryptPassword = encryptPassword;
    this.EncryptOtp = encryptOtp;
    this.GenerateMail = generateMail;
    this.JwtToken = jwtToken;
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
    console.log("OTP: " + otp);

    const user = {
      email,
      userName,
      displayName,
      password,
    };
    const hashedOtp = await this.EncryptOtp.encrypt(otp);
    const hashedPassword = await this.EncryptPassword.encrypt(password);
    await this.UserRepository.saveOtp(
      email,
      hashedOtp,
      userName,
      displayName,
      hashedPassword
    );

    await this.GenerateMail.sendMail(email, otp);

    return {
      status: 200,
      data: {
        status: true,
        message: "Verification otp sent to your email",
      },
    };
  }

  async verifyOtp(email: string, otp: number) {
    const otpData = await this.UserRepository.findOtpByEmail(email);
    console.log(otpData);
    if (!otpData) {
      return { status: 400, message: "Invalid or expired OTP" };
    }

    const data: {
      userName: string;
      displayName: string;
      password: string;
      email: string;
    } = {
      userName: otpData.userName,
      displayName: otpData.displayName,
      password: otpData.password,
      email: otpData.email,
    };

    const now = new Date().getTime();
    const otpGeneratedAt = new Date(otpData.otpGeneratedAt).getTime();
    const otpExpiration = 1 * 60 * 1000;

    if (now - otpGeneratedAt > otpExpiration) {
      await this.UserRepository.deleteOtpByEmail(email);
      return { status: 400, message: "OTP has expired" };
    }

    const isVerified = await this.EncryptOtp.compare(otp, otpData.otp);

    if (isVerified) {
      const userData = await this.UserRepository.saveUser(data);
      await this.UserRepository.deleteOtpByEmail(email);

      const token = this.JwtToken.generateToken(userData._id, "user");

      return {
        status: 200,
        data: {
          status: true,
          message: "Welcome to our community!",
          token,
        },
      };
    } else {
      return { status: 400, message: "Incorrect OTP" };
    }
  }

  async verifyUser(email: string, password: string) {
    const isVerified = await this.UserRepository.findByEmail(email);

    if (!isVerified) {
      return {
        status: 400,
        message: "User doesn't exist",
      };
    }
    const passwordVerified = await this.EncryptPassword.compare(
      password,
      isVerified?.password
    );

    const token = this.JwtToken.generateToken(isVerified._id, "user");
    if (passwordVerified === false) {
      return {
        status: 400,
        message: "Wrong password",
      };
    }
    const userData = {
      userName: isVerified.userName,
      displayName: isVerified.displayName,
      email: isVerified.email,
    };
    return {
      status: 200,
      data: {
        userData,
        status: true,
        message: "Login successful. Welcome back!",
        token,
      },
    };
  }
}

export default UserUsecase;
