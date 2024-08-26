import mongoose from "mongoose";
import Otp from "../entities/otp";
import User from "../entities/user";
import UserNotifications from "../entities/userNotification";
import UserNotificationsModel from "../frameworks/models/UserNotificationsModel";
import OtpModel from "../frameworks/models/otpModel";
import UserModel from "../frameworks/models/userModel";
import UserRepo from "../usecase/interfaces/user/IuserRepo";
import UserLocation from "../entities/userLocation";
import UserLocationModel from "../frameworks/models/userLocationModel";
import TicketModel from "../frameworks/models/ticketModel";
import Ticket from "../entities/ticket";

class UserRepository implements UserRepo {
  async findByEmail(email: string): Promise<User | null> {
    const userData = await UserModel.findOne({ email: email });
    return userData;
  }

  async findUserName(userName: string): Promise<User | null> {
    const userData = await UserModel.findOne({ userName: userName });
    return userData;
  }

  async saveUser(user: User): Promise<User> {
    const newUser = new UserModel(user);
    const savedUser = await newUser.save();
    return savedUser;
  }

  async saveOtp(
    email: string,
    otp: string,
    userName?: string,
    displayName?: string,
    password?: string
  ): Promise<any> {
    const filter = { email };
    const update: any = {
      email,
      otp,
      otpGeneratedAt: new Date(),
      ...(userName && { userName }),
      ...(displayName && { displayName }),
      ...(password && { password }),
    };

    const options = {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    };

    try {
      const savedOtp = await OtpModel.findOneAndUpdate(
        filter,
        update,
        options
      ).exec();
      return savedOtp;
    } catch (error) {
      throw new Error("Failed to save OTP.");
    }
  }

  async findOtpByEmail(email: string): Promise<any> {
    return OtpModel.findOne({ email });
  }

  async deleteOtpByEmail(email: string): Promise<any> {
    return OtpModel.deleteOne({ email });
  }

  async findById(id: string): Promise<User | null> {
    return UserModel.findById(id).lean().exec();
  }

  async updateUser(user: User): Promise<User | null> {
    const { _id, ...updateData } = user;
    return UserModel.findOneAndUpdate({ _id: user._id }, updateData, {
      new: true,
    }).exec();
  }

  async fetchNotifications(userId: string): Promise<UserNotifications | null> {
    try {
      let objectId: mongoose.Types.ObjectId;

      try {
        objectId = new mongoose.Types.ObjectId(userId);
      } catch (error) {
        console.error("Invalid userId format:", userId);
        return null;
      }

      const userNotifications = await UserNotificationsModel.findOne({
        userId: objectId,
      })
        .lean()
        .exec();
      return userNotifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  async clearNotifications(userId: string): Promise<void> {
    try {
      let objectId: mongoose.Types.ObjectId;

      try {
        objectId = new mongoose.Types.ObjectId(userId);
      } catch (error) {
        console.error("Invalid userId format:", userId);
        throw new Error("Invalid userId format");
      }

      await UserNotificationsModel.updateOne(
        { userId: objectId },
        { $set: { notifications: [] } }
      ).exec();
    } catch (error) {
      console.error("Error clearing notifications:", error);
      throw error;
    }
  }

  async raiseTicket(
    userId: string,
    subject: string,
    description: string
  ): Promise<Ticket> {
    try {
      let objectId: mongoose.Types.ObjectId;

      try {
        objectId = new mongoose.Types.ObjectId(userId);
      } catch (error) {
        console.error("Invalid userId format:", userId);
        throw new Error("Invalid userId format");
      }

      const newTicket = new TicketModel({
        userId: objectId,
        subject,
        description,
        status: "Pending",
        created: new Date(),
        adminReplies: [],
      });

      const savedTicket = await newTicket.save();
      return savedTicket.toObject() as Ticket;
    } catch (error) {
      console.error("Error raising ticket:", error);
      throw error;
    }
  }

  async fetchTickets(userId: string): Promise<Ticket[]> {
    try {
      let objectId: mongoose.Types.ObjectId;

      try {
        objectId = new mongoose.Types.ObjectId(userId);
      } catch (error) {
        console.error("Invalid userId format:", userId);
        throw new Error("Invalid userId format");
      }

      const tickets = await TicketModel.find({ userId: objectId })
        .sort({ created: -1 })
        .lean()
        .exec();

      return tickets as Ticket[];
    } catch (error) {
      console.error("Error fetching tickets:", error);
      throw error;
    }
  }
}

export default UserRepository;
