import mongoose from "mongoose";
import ZepchatRepository from "../repository/zepchatRepository";
import Zepchat from "../entities/zepChat";
import ZepReply from "../entities/zepReply";

class ZepchatUseCase {
  private _zepchatRepository: ZepchatRepository;

  constructor(zepchatRepository: ZepchatRepository) {
    this._zepchatRepository = zepchatRepository;
  }

  async createZepchat(
    title: string,
    content: string,
    tags: string[],
    userId: string
  ) {
    try {
      if (!title || !content || !tags || !userId) {
        return {
          status: 400,
          message: "Data Not Found",
        };
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return {
          status: 400,
          message: "Invalid User ID",
        };
      }

      const user = await this._zepchatRepository.findUserById(userId);
      if (!user) {
        return {
          status: 404,
          message: "User Not Found",
        };
      }

      const zepchatData: Zepchat = {
        title,
        content,
        tags,
        author: {
          _id: new mongoose.Types.ObjectId(userId),
          displayName: user.displayName,
          profilePicture: user.profilePicture || "",
        },
        upVotes: 0,
        downVotes: 0,
        timestamp: new Date(),
      };

      const created = await this._zepchatRepository.createZepchat(zepchatData);

      if (!created) {
        return {
          status: 400,
          message: "Creation Failed",
        };
      }

      return {
        status: 201,
        message: "Zepchat created successfully",
      };
    } catch (error) {
      return {
        status: 500,
        message: "Something Went Wrong",
      };
    }
  }

  async fetchZepchats() {
    try {
      const zepchats = await this._zepchatRepository.getZepchats();
      if (!zepchats || zepchats.length === 0) {
        return {
          status: 404,
          message: "Zepchats Not Found",
        };
      }
      return {
        status: 200,
        data: zepchats,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Something Went Wrong",
      };
    }
  }

  async postReply(zepChatId: string, userId: string, content: string) {
    try {
      if (!zepChatId || !content || !userId) {
        return {
          status: 400,
          message: "Data Not Found",
        };
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return {
          status: 400,
          message: "Invalid User ID",
        };
      }

      const user = await this._zepchatRepository.findUserById(userId);
      if (!user) {
        return {
          status: 404,
          message: "User Not Found",
        };
      }

      const zepReply: ZepReply = {
        content,
        userId: new mongoose.Types.ObjectId(userId),
        zepChatId: new mongoose.Types.ObjectId(zepChatId),
        displayName: user.displayName,
        profilePicture: user.profilePicture || "",
        upVotes: 0,
        downVotes: 0,
      };

      const created = await this._zepchatRepository.postReply(zepReply);

      if (!created) {
        return {
          status: 400,
          message: "Creation Failed",
        };
      }

      return {
        status: 201,
        message: "Replied Successfully",
      };
    } catch (error) {
      return {
        status: 500,
        message: "Something Went Wrong",
      };
    }
  }

  async getZepReplies(zepChatId: string) {
    try {
      if (!zepChatId) {
        return {
          status: 400,
          message: "Id not found",
        };
      }

      const replies = await this._zepchatRepository.fetchReplies(zepChatId);

      if (!replies || replies.length === 0) {
        return {
          status: 404,
          message: "Replies Not Found",
        };
      }

      return {
        status: 200,
        data: replies,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Something Went Wrong",
      };
    }
  }

  async getZepchat(zepChatId: string) {
    try {
      if (!zepChatId) {
        return {
          status: 400,
          message: "Id not found",
        };
      }

      const zepchat = await this._zepchatRepository.fetchZepchatById(zepChatId);

      if (!zepchat) {
        return {
          status: 404,
          message: "Zepchat Not Found",
        };
      }

      return {
        status: 200,
        data: zepchat,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Something Went Wrong",
      };
    }
  }

  async voteReply(replyId: string, voteType: string, userId: string) {
    try {
      if (!replyId || !voteType || !userId) {
        return {
          status: 400,
          message: "Data missing",
        };
      }

      const reply = await this._zepchatRepository.getReplyById(replyId);

      if (!reply) {
        return {
          status: 404,
          message: "Reply Not Found",
        };
      }

      const userObjectId = new mongoose.Types.ObjectId(userId);

      switch (voteType) {
        case "upVote":
          if (
            !reply.upVoters?.some((voter) => voter.userId.toString() === userId)
          ) {
            reply.upVotes += 1;
            reply.upVoters?.push({ userId: userObjectId });
            reply.downVoters = reply.downVoters?.filter(
              (voter) => voter.userId.toString() !== userId
            );
            if (reply.downVotes > 0) reply.downVotes -= 1;
          }
          break;
        case "downVote":
          if (
            !reply.downVoters?.some(
              (voter) => voter.userId.toString() === userId
            )
          ) {
            reply.downVotes += 1;
            reply.downVoters?.push({ userId: userObjectId });
            reply.upVoters = reply.upVoters?.filter(
              (voter) => voter.userId.toString() !== userId
            );
            if (reply.upVotes > 0) reply.upVotes -= 1;
          }
          break;
        case "removeUpVote":
          reply.upVotes = Math.max(0, reply.upVotes - 1);
          reply.upVoters = reply.upVoters?.filter(
            (voter) => voter.userId.toString() !== userId
          );
          break;
        case "removeDownVote":
          reply.downVotes = Math.max(0, reply.downVotes - 1);
          reply.downVoters = reply.downVoters?.filter(
            (voter) => voter.userId.toString() !== userId
          );
          break;
        default:
          return {
            status: 400,
            message: "Invalid vote type",
          };
      }

      const savedReply = await this._zepchatRepository.voteSave(reply);

      if (!savedReply) {
        return {
          status: 400,
          message: "Save Vote Failed",
        };
      }

      return {
        status: 200,
        message: "Voted Successfully",
        data: savedReply,
      };
    } catch (error) {
      console.error("Error in voteReply:", error);
      return {
        status: 500,
        message: "Something Went Wrong",
      };
    }
  }

  async voteZepchat(zepchatId: string, voteType: string, userId: string) {
    try {
      if (!zepchatId || !voteType || !userId) {
        return {
          status: 400,
          message: "Data missing",
        };
      }

      const zepchat = await this._zepchatRepository.fetchZepchatById(zepchatId);

      if (!zepchat) {
        return {
          status: 404,
          message: "Zepchat Not Found",
        };
      }

      const userObjectId = new mongoose.Types.ObjectId(userId);

      switch (voteType) {
        case "upVote":
          if (
            !zepchat.upVoters?.some(
              (voter) => voter.userId.toString() === userId
            )
          ) {
            zepchat.upVotes += 1;
            zepchat.upVoters?.push({ userId: userObjectId });
            zepchat.downVoters = zepchat.downVoters?.filter(
              (voter) => voter.userId.toString() !== userId
            );
            if (zepchat.downVotes > 0) zepchat.downVotes -= 1;
          }
          break;
        case "downVote":
          if (
            !zepchat.downVoters?.some(
              (voter) => voter.userId.toString() === userId
            )
          ) {
            zepchat.downVotes += 1;
            zepchat.downVoters?.push({ userId: userObjectId });
            zepchat.upVoters = zepchat.upVoters?.filter(
              (voter) => voter.userId.toString() !== userId
            );
            if (zepchat.upVotes > 0) zepchat.upVotes -= 1;
          }
          break;
        case "removeUpVote":
          zepchat.upVotes = Math.max(0, zepchat.upVotes - 1);
          zepchat.upVoters = zepchat.upVoters?.filter(
            (voter) => voter.userId.toString() !== userId
          );
          break;
        case "removeDownVote":
          zepchat.downVotes = Math.max(0, zepchat.downVotes - 1);
          zepchat.downVoters = zepchat.downVoters?.filter(
            (voter) => voter.userId.toString() !== userId
          );
          break;
        default:
          return {
            status: 400,
            message: "Invalid vote type",
          };
      }

      const savedZepchat = await this._zepchatRepository.ZepchatSave(zepchat);

      if (!savedZepchat) {
        return {
          status: 400,
          message: "Save Vote Failed",
        };
      }

      return {
        status: 200,
        message: "Voted Successfully",
        data: savedZepchat,
      };
    } catch (error) {
      console.error("Error in voteZepchat:", error);
      return {
        status: 500,
        message: "Something Went Wrong",
      };
    }
  }

  async deleteZepchat(zepchatId: string, userId: string) {
    try {
      if (!zepchatId) {
        return {
          status: 400,
          message: "id not found ",
        };
      }

      const zepchat = await this._zepchatRepository.fetchZepchatById(zepchatId);

      if (!zepchat) {
        return {
          status: 400,
          message: "Zepchat not found",
        };
      }
      const user = new mongoose.Types.ObjectId(userId);

      if (zepchat.author._id.toString() !== user.toString()) {
        return {
          status: 400,
          message: "IDs mismatch",
        };
      }
      const deleteZepchat = await this._zepchatRepository.deleteZepchat(
        zepchatId
      );

      if (deleteZepchat) {
        const clearReplies = await this._zepchatRepository.clearReplies(
          zepchatId
        );

        if (clearReplies) {
          return {
            status: 200,
            message: "Zepchat Deleted Successfully",
          };
        }
      }

      return {
        status: 200,
        message: "Zepchat deleted successfully",
      };
    } catch (error) {
      console.error("An Error occured:", error);
      return {
        status: 500,
        message: "Something Went Wrong",
      };
    }
  }

  async updateZepchat(
    zepchatId: string,
    title?: string,
    content?: string,
    tags?: string[]
  ) {
    try {
      if (!zepchatId) {
        return {
          status: 400,
          message: "ZepchatId not found",
        };
      }
      const zepchat = await this._zepchatRepository.fetchZepchatById(zepchatId);

      if (!zepchat) {
        return {
          status: 400,
          message: "Zepchat not found",
        };
      }

      if (title) {
        zepchat.title = title;
      }
      if (content) {
        zepchat.content = content;
      }

      if (tags) {
        zepchat.tags = tags;
      }

      await this._zepchatRepository.ZepchatSave(zepchat);

      return {
        status: 200,
        message: "Zepchat Edited Successfully",
      };
    } catch (error) {
      console.error("An Error occured:", error);
      return {
        status: 500,
        message: "Something Went Wrong",
      };
    }
  }

  async getMyZepchats(userId: string) {
    try {
      if (!userId) {
        return {
          status: 400,
          message: "Data not Found",
        };
      }

      const zepchats = await this._zepchatRepository.fetchMyZepchats(userId);

      if (zepchats) {
        return {
          status: 200,
          data: zepchats,
        };
      }

      return {
        status: 400,
        message: "Zepchats not Found",
      };
    } catch (error) {
      console.error("An Error occured:", error);
      return {
        status: 500,
        message: "Something Went Wrong",
      };
    }
  }
}

export default ZepchatUseCase;
