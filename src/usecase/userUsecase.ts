import EncryptOtp from "../frameworks/utils/bcryptOtp";
import EncryptPassword from "../frameworks/utils/bcryptPassword";
import GenerateOtp from "../frameworks/utils/generateOtp";
import JWTToken from "../frameworks/utils/generateToken";
import sendOtp from "../frameworks/utils/sendMail";
import UserRepository from "../repository/userRepository";

class UserUsecase {
  private _userRepository: UserRepository;
  private _generateOtp: GenerateOtp;
  private _encryptPassword: EncryptPassword;
  private _encryptOtp: EncryptOtp;
  private _generateMail: sendOtp;
  private _jwtToken: JWTToken;

  constructor(
    UserRepository: UserRepository,
    generateOtp: GenerateOtp,
    encryptPassword: EncryptPassword,
    encryptOtp: EncryptOtp,
    generateMail: sendOtp,
    jwtToken: JWTToken
  ) {
    this._userRepository = UserRepository;
    this._generateOtp = generateOtp;
    this._encryptPassword = encryptPassword;
    this._encryptOtp = encryptOtp;
    this._generateMail = generateMail;
    this._jwtToken = jwtToken;
  }

  async checkExist(email: string) {
    try {
      const userExist = await this._userRepository.findByEmail(email);
      if (userExist) {
        return {
          status: 400,
          message: "User already exist",
        };
      } else {
        return {
          status: 200,
          message: "User does not exist",
        };
      }
    } catch (error) {
      return {
        status: 400,
        message: "An error occurred",
      };
    }
  }

  async signup(
    email: string,
    userName: string,
    displayName: string,
    password: string
  ) {
    try {
      const otp = this._generateOtp.createOtp();
      console.log("OTP: " + otp);

      const user = {
        email,
        userName,
        displayName,
        password,
      };
      const hashedOtp = await this._encryptOtp.encrypt(otp);
      const hashedPassword = await this._encryptPassword.encrypt(password);
      await this._userRepository.saveOtp(
        email,
        hashedOtp,
        userName,
        displayName,
        hashedPassword
      );

      await this._generateMail.sendMail(email, otp);

      return {
        status: 200,
        message: "Verification otp sent to your email",
      };
    } catch (error) {
      return {
        status: 400,
        message: "An error occurred",
      };
    }
  }

  async verifyOtp(email: string, otp: number) {
    try {
      const otpData = await this._userRepository.findOtpByEmail(email);

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
        await this._userRepository.deleteOtpByEmail(email);
        return { status: 400, message: "OTP has expired" };
      }
      const isVerified = await this._encryptOtp.compare(otp, otpData.otp);

      if (isVerified) {
        const userData = await this._userRepository.saveUser(data);
        await this._userRepository.deleteOtpByEmail(email);

        const token = this._jwtToken.generateToken(userData._id, "user");

        return {
          status: 200,
          data: {
            userData,
            message: "Welcome to our Zephyr!",
            token,
          },
        };
      } else {
        return { status: 400, message: "Incorrect OTP" };
      }
    } catch (error) {
      return {
        status: 400,
        message: "An error occurred",
      };
    }
  }

  async resendOtp(email: string) {

    try {
      const newOtp = this._generateOtp.createOtp();
      console.log("New OTP:" + newOtp);
      this._generateMail.sendMail(email, newOtp);
      let user = await this._userRepository.findByEmail(email)
      if (!user) {
        user = await this._userRepository.findOtpByEmail(email)
      }

      let userData: {
        userName: string;
        displayName: string;
        profile: string | null;
        status: "Online" | "Idle" | "Do not Disturb";
        joined_date: Date | null;
      } | null = null;

      if (user) {
        userData = {
          userName: user.userName,
          displayName: user.displayName,
          profile: user.profilePicture || null,
          status: user.status || "Online",
          joined_date: user.joined_date || null,
        };
      }




      const hashedOtp = await this._encryptOtp.encrypt(newOtp);

      await this._userRepository.saveOtp(email, hashedOtp);
      return {
        status: 200,
        data: {
          userData,
          message: "OTP has been sent to your email",
        },
      };
    } catch (error) {
      return {
        status: 400,
        message: "An error occurred",
      };
    }
  }

  async verifyUser(email: string, password: string) {
    try {
      const isVerified = await this._userRepository.findByEmail(email);

      let userData: {
        userName: string;
        displayName: string;
        profile: string | null;
        status: "Online" | "Idle" | "Do not Disturb";
        joined_date: Date | null;
      } | null = null;

      if (isVerified) {
        userData = {
          userName: isVerified.userName,
          displayName: isVerified.displayName,
          profile: isVerified.profilePicture || null,
          status: isVerified.status || "Online",
          joined_date: isVerified.joined_date || null,
        };
      }


      if (!isVerified) {
        return {
          status: 400,
          message: "User doesn't exist",
        };
      }
      const passwordVerified = await this._encryptPassword.compare(
        password,
        isVerified?.password
      );


      const token = this._jwtToken.generateToken(isVerified._id, "user");
      if (passwordVerified === false) {
        return {
          status: 400,
          message: "Wrong password",
        };
      };
      return {
        status: 200,
        data: {
          userData,
          message: "Login successful. Welcome back!",
          token,
        },
      };
    } catch (error) {
      return {
        status: 400,
        message: "An error occurred",
      };
    }
  }

  async verifyForgot(email: string, otp: number) {
    try {
      const otpData = await this._userRepository.findOtpByEmail(email);
      const otpVerified = await this._encryptOtp.compare(otp, otpData.otp);

      const now = new Date().getTime();
      const otpGeneratedAt = new Date(otpData.otpGeneratedAt).getTime();
      const otpExpiration = 1 * 60 * 1000;

      if (now - otpGeneratedAt > otpExpiration) {
        await this._userRepository.deleteOtpByEmail(email);
        return {
          status: 400,
          message: "OTP has expired",
        };
      }

      if (otpVerified) {
        return {
          status: 200,
          data: {
            message: "OTP Successfully verified",
          }
        };
      } else {
        return {
          status: 400,
          message: "Incorrect OTP",
        };
      }
    } catch (error) {
      return {
        status: 400,
        message: "An error occurred",
      };
    }
  }
}

export default UserUsecase;
