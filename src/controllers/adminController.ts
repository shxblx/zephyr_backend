import { Request, Response, NextFunction } from "express";
import AdminUsecase from "../usecase/adminUsecase";

class AdminController {
  private _adminUsecase: AdminUsecase;

  constructor(adminUsecase: AdminUsecase) {
    this._adminUsecase = adminUsecase;
  }

  async adminLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const isAdmin = await this._adminUsecase.verifyAdmin(
        req.body.email,
        req.body.password
      );

      if (isAdmin.isAdmin === true) {
        res.cookie("adminJwt", isAdmin.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: "none",
        });
        return res.status(isAdmin.status).json(isAdmin.isAdmin);
      }
      if (isAdmin.data?.passwordMatch === false) {
        return res.status(isAdmin.status).json(isAdmin.data);
      }
      return res.status(isAdmin.status).json(isAdmin.data);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = await this._adminUsecase.getUserData();

      if (userData?.status === 200) {
        return res.status(userData.status).json(userData);
      } else {
        return res.status(userData.status).json(userData.message);
      }
    } catch (error) {
      next(error);
    }
  }

  async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userBlocked = await this._adminUsecase.blockUser(req.body.userId);
      return res.sendStatus(userBlocked.status);
    } catch (error) {
      console.error("Error in blockUser route:", error);
      return res.sendStatus(500);
    }
  }

  async unBlockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userUnblocked = await this._adminUsecase.unblockUser(
        req.body.userId
      );
      return res.sendStatus(userUnblocked.status);
    } catch (error) {
      console.error("Error in Unblock route", error);
      res.sendStatus(500);
    }
  }

  async getCommunities(req: Request, res: Response, next: NextFunction) {
    try {
      const communities = await this._adminUsecase.getCommunities();

      if (communities.status === 200) {
        return res.status(communities.status).json(communities.communities);
      }
      return res.status(communities.status).json(communities.status);
    } catch (error) {
      next(error);
    }
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie("adminJwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        expires: new Date(0),
        sameSite: "none",
      });

      return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      next(error);
    }
  }

  async banCommunity(req: Request, res: Response, next: NextFunction) {
    try {
      const banCommunity = await this._adminUsecase.banCommunity(
        req.body.communityId
      );
      return res.status(banCommunity.status).json(banCommunity.message);
    } catch (error) {
      next(error);
    }
  }

  async unbanCommunity(req: Request, res: Response, next: NextFunction) {
    try {
      const unbanCommunity = await this._adminUsecase.unbanCommunity(
        req.body.communityId
      );
      return res.status(unbanCommunity.status).json(unbanCommunity.message);
    } catch (error) {
      next(error);
    }
  }

  async getUserInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const user = await this._adminUsecase.getUserInfo(userId);
      if (user.status === 200) {
        return res.status(user.status).json(user.data);
      }
      return res.status(user.status).json(user.message);
    } catch (error) {
      next(error);
    }
  }
  async getReports(req: Request, res: Response, next: NextFunction) {
    try {
      const reports = await this._adminUsecase.getReports();
      if (reports.status === 200) {
        return res.status(reports.status).json(reports.data);
      }
      return res.status(reports.status).json(reports.message);
    } catch (error) {
      next(error);
    }
  }
  async getCommunityReports(req: Request, res: Response, next: NextFunction) {
    try {
      const reports = await this._adminUsecase.getCommunityReports();
      if (reports.status === 200) {
        return res.status(reports.status).json(reports.data);
      }
      return res.status(reports.status).json(reports.message);
    } catch (error) {
      next(error);
    }
  }
  async getTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const tickets = await this._adminUsecase.getTickets();
      if (tickets.status === 200) {
        return res.status(tickets.status).json(tickets.data);
      }
      return res.status(tickets.status).json(tickets.message);
    } catch (error) {
      next(error);
    }
  }
  async updateTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const { ticketId, newStatus, adminComments } = req.body;
      const tickets = await this._adminUsecase.updateTicket(
        ticketId,
        newStatus,
        adminComments
      );
      return res.status(tickets.status).json(tickets.message);
    } catch (error) {
      next(error);
    }
  }
}

export default AdminController;
