import User from "../entities/user";
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



      const user = {
        email,
        userName,
        displayName,
        password,
      };
      console.log("OTP:", otp);

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
        const savedUser = await this._userRepository.saveUser(data);

        if (!savedUser) {
          return { status: 500, message: "Failed to save user" };
        }

        await this._userRepository.deleteOtpByEmail(email);

        const userData: Omit<User, 'password'> = {
          _id: savedUser._id,
          userName: savedUser.userName,
          displayName: savedUser.displayName,
          email: savedUser.email,
          wallet: savedUser.wallet,
          status: savedUser.status,
          profilePicture: savedUser.profilePicture,
          isPremium: savedUser.isPremium,
          isBlocked: savedUser.isBlocked,
          isAdmin: savedUser.isAdmin,
          joined_date: savedUser.joined_date
        };

        const token = this._jwtToken.generateToken(savedUser._id, "user");

        return {
          status: 200,
          data: {
            userData,
            message: "Welcome to Zephyr!",
            token,
          },
        };
      } else {
        return { status: 400, message: "Incorrect OTP" };
      }
    } catch (error) {
      console.error('Error in verifyOtp:', error);
      return {
        status: 500,
        message: "An error occurred while verifying OTP",
      };
    }
  }

  async resendOtp(email: string) {
    try {
      const newOtp = this._generateOtp.createOtp();
      console.log("New OTP:" + newOtp);

      await this._generateMail.sendMail(email, newOtp);

      let user = await this._userRepository.findByEmail(email);
      if (!user) {
        user = await this._userRepository.findOtpByEmail(email);
      }

      if (!user) {
        return {
          status: 404,
          message: "User not found",
        };
      }

      const userData: Omit<User, 'password'> = {
        _id: user._id,
        userName: user.userName,
        displayName: user.displayName,
        email: user.email,
        wallet: user.wallet,
        status: user.status,
        profilePicture: user.profilePicture,
        isPremium: user.isPremium,
        isBlocked: user.isBlocked,
        isAdmin: user.isAdmin,
        joined_date: user.joined_date
      };

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
      console.error('Error in resendOtp:', error);
      if (error instanceof Error) {
        return {
          status: 500,
          message: `An error occurred: ${error.message}`,
        };
      }
      return {
        status: 500,
        message: "An unexpected error occurred",
      };
    }
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this._userRepository.findByEmail(email);

      if (!user) {
        return {
          status: 400,
          message: "User doesn't exist",
        };
      }

      if (user.isBlocked === true) {
        return {
          status: 400,
          message: "Unauthorized Access"
        }
      }

      const passwordVerified = await this._encryptPassword.compare(
        password,
        user.password
      );

      if (!passwordVerified) {
        return {
          status: 400,
          message: "Wrong password",
        };
      }

      const token = this._jwtToken.generateToken(user._id, "user");

      const userData: Omit<User, 'password'> = {
        _id: user._id,
        userName: user.userName,
        displayName: user.displayName,
        email: user.email,
        wallet: user.wallet,
        status: user.status,
        profilePicture: user.profilePicture,
        isPremium: user.isPremium,
        isBlocked: user.isBlocked,
        isAdmin: user.isAdmin,
        joined_date: user.joined_date
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
      const otpVerified = await this._encryptOtp.compare(otp, otpData.otp)

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
      const user = await this._userRepository.findByEmail(email)



      if (otpVerified && user) {
        const userData: Omit<User, 'password'> = {
          _id: user._id,
          userName: user.userName,
          displayName: user.displayName,
          email: user.email,
          wallet: user.wallet,
          status: user.status,
          profilePicture: user.profilePicture,
          isPremium: user.isPremium,
          isBlocked: user.isBlocked,
          isAdmin: user.isAdmin,
          joined_date: user.joined_date
        };
        return {
          status: 200,
          data: {
            userData,
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
      console.log(error);

      return {
        status: 400,
        message: "An error occurred",
      };
    }
  }

  async fetchUser(userId: string) {
    try {
      const user = await this._userRepository.findById(userId);
      if (user) {
        const userData: Omit<User, 'password'> = {
          _id: user._id,
          userName: user.userName,
          displayName: user.displayName,
          email: user.email,
          wallet: user.wallet,
          status: user.status,
          profilePicture: user.profilePicture,
          isPremium: user.isPremium,
          isBlocked: user.isBlocked,
          isAdmin: user.isAdmin,
          joined_date: user.joined_date
        };
        return {
          status: 200,
          data: {
            userData
          }
        };
      } else {
        return {
          status: 404,
          message: 'User not found'
        };
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  }

  async statusChange(status: string, userId: string) {
    try {
      const user = await this._userRepository.findById(userId);
      if (!user) {
        return {
          status: 400,
          message: "User not Found"
        }
      }

      user.status = status;

      await this._userRepository.updateUser(user);

      return {
        status: 200,
        message: "Status updated successfully"
      }
    } catch (error) {
      console.log(error);

      return {
        status: 400,
        message: "An error Occured"
      }
    }
  }

  async userNameChange(userId: string, newName: string) {
    try {
      const user = await this._userRepository.findById(userId);

      if (!user) {
        return {
          status: 404,
          message: "User not found",
        };
      }


      user.userName = newName;
      console.log(user);

      await this._userRepository.updateUser(user);

      return {
        status: 200,
        message: "Username updated successfully",
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: "Internal server error",
      };
    }
  }


  async displayNameChange(userId: string, newName: string) {
    try {
      const user = await this._userRepository.findById(userId);

      if (!user) {
        return {
          status: 404,
          message: "User not found",
        };
      }


      user.displayName = newName;
      console.log(user);

      await this._userRepository.updateUser(user);

      return {
        status: 200,
        message: "DisplayName updated successfully",
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: "Internal server error",
      };
    }
  }


  async passwordChange(userId: string, currentPassword: string, newPassword: string) {
    try {
      const user = await this._userRepository.findById(userId);

      if (!user) {
        return {
          status: 404,
          message: "User not found",
        };
      }

      const passwordMatch = await this._encryptPassword.compare(currentPassword, user.password)
      console.log(passwordMatch);


      if (!passwordMatch) {
        return {
          status: 400,
          message: "Old Password Do not Match"
        }
      }

      const hashedPassword = await this._encryptPassword.encrypt(newPassword)
      user.password = hashedPassword;
      await this._userRepository.updateUser(user);
      return {
        status: 200,
        message: "Password changed successfully",
      };

    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: "Internal server error",
      };
    }
  }


}

export default UserUsecase;
