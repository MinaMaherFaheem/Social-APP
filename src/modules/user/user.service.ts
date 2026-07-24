import { Request, Response } from "express";
import { UserRepository } from "../../DB/repository/user.repository";
import { GenderEnum, HUserDocument, RoleEnum, UserModel } from "../../models/user.model";
import { IFreezeAccountDTO, IHardDeleteDTO, ILogoutDto, IRestoreAccountDTO } from "./user.dto";
import { Types, UpdateQuery } from "mongoose";
import { createLoginCredentials, createRevokeToken, LogoutEnum } from "../../utils/security/token.security";
import { JwtPayload } from "jsonwebtoken";
import { createPresignedUploadLink, deleteFiles, deleteFolderByPrefix, uploadFiles } from "../../utils/multer/s3.config";
import { StorageEnum } from "../../utils/multer/cloud.multer";
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from "../../utils/response/error.reponse";
import { s3Event } from "../../utils/multer/s3.events";
import { successResponse } from "../../utils/response/success.response";
import { IUserProfileResponse, IProfileImageResponse } from "./user.entities";
import { ILoginResponse } from "../auth/auth.entities";
import { ChatRepository, FriendRequestRepository, PostRepository } from "../../DB/repository";
import { ChatModel, FriendRequestModel, PostModel } from "../../models";
import { GraphQLError } from "graphql";


export interface IUser {
  id: number;
  name: string;
  email: string;
  gender: GenderEnum;
  password: string;
  followers: number[];
}

let users: IUser[] = [
  {
    id: 1,
    name: "mina",
    email: "mina@gmail.com",
    gender: GenderEnum.male,
    password: "12345",
    followers: [],
  },
  {
    id: 2,
    name: "maher",
    email: "maher@gmail.com",
    gender: GenderEnum.male,
    password: "112233",
    followers: [],
  },
  {
    id: 3,
    name: "faheem",
    email: "faheem@gmail.com",
    gender: GenderEnum.male,
    password: "112211",
    followers: [],
  },
  {
    id: 4,
    name: "ayoub",
    email: "ayoub@gmail.com",
    gender: GenderEnum.male,
    password: "232422",
    followers: [],
  },
];


export class UserService {
  private userModel = new UserRepository(UserModel);
  private postModel = new PostRepository(PostModel);
  private chatModel = new ChatRepository(ChatModel);
  private friendRequestModel = new FriendRequestRepository(FriendRequestModel);
  constructor() {}

  profile = async (req: Request, res: Response): Promise<Response> => {
    const profile = await this.userModel.findById({
      id: req.user?._id as Types.ObjectId,
      options: {
        populate: [
          {
            path: "friends",
            select: "firstName lastName email gender profilePicture"
          }
        ]
      }
    });

    if (!profile) {
      throw new NotFoundException("fail to find user profile");
    };

    const groups = await this.chatModel.find({
      filter: {
        participants: { $in: req.user?._id }, 
        group:{ $exists: true }
      },
    });
    

    return successResponse<IUserProfileResponse>({ res, data: { user: profile, groups } });
  };

  dashboard = async (req: Request, res: Response): Promise<Response> => {
    const results = await Promise.allSettled([
      this.userModel.find({filter: {}}),
      this.postModel.find({filter: {}})
    ]);

    return successResponse({ res, data: { results } });
  };

  changeRole = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params as unknown as { userId: Types.ObjectId };
    const { role }:{ role: RoleEnum } = req.body
    const denyRoles:RoleEnum[] = [ role, RoleEnum.superAdmin ];

    if (req.user?.role === RoleEnum.admin) {
      denyRoles.push(RoleEnum.admin)
    }

    const user = await this.userModel.findOneAndUpdate({
      filter: {
        _id: userId as Types.ObjectId,
        role: { $nin: denyRoles }
      },
      update: {
        role
      }
    });

    if (!user) {
      throw new NotFoundException("fail to find matching result");
    };

    return successResponse({ res });
  };

  sendFriendRequest = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params as unknown as { userId: Types.ObjectId };
    const checkFriendRequestExist = await this.friendRequestModel.findOne({
      filter: {
        createdBy: { $in: [req.user?._id, userId] },
        sendTo: { $in: [req.user?._id, userId] }
      }
    });

    if (checkFriendRequestExist) {
      throw new ConflictException("Friend request already exist");
    }

    const user = await this.userModel.findOne({
      filter: {
        _id: userId
      }
    });

    if (!user) {
      throw new NotFoundException("Invalid recipient");
    }

    const [friendRequest] = (await this.friendRequestModel.create({
      data: [
        {
        createdBy: req.user?._id as Types.ObjectId,
        sendTo: userId
        }
      ]
    })) || [];

    if (!friendRequest) {
      throw new BadRequestException("something went wrong!!!");
    }
    
    return successResponse({ res, statusCode: 201 });
  };

  acceptFriendRequest = async (req: Request, res: Response): Promise<Response> => {
    const { requestId } = req.params as unknown as { requestId: Types.ObjectId };
    const friendRequest = await this.friendRequestModel.findOneAndUpdate({
      filter: {
        _id: requestId,
        sendTo: req.user?._id,
        acceptedAt: { $exists: false }
      },
      update: {
        acceptedAt: new Date()
      }
    });

    if (!friendRequest) {
      throw new NotFoundException("Fail to found matching result");
    };

    await Promise.all([
      await this.userModel.updateOne({
        filter: { _id: friendRequest.createdBy },
        update: {
          $addToSet: { friends: friendRequest.sendTo }
        }
      }),
      await this.userModel.updateOne({
        filter: { _id: friendRequest.sendTo },
        update: {
          $addToSet: { friends: friendRequest.createdBy }
        }
      })
    ])

    return successResponse({ res });
  };

  profileImage = async (req: Request, res: Response): Promise<Response> => {
    // const key = await uploadLargeFile({
    //   storageApproach: StorageEnum.disk,
    //   file: req.file as Express.Multer.File,
    //   path: `users/${req.decoded?._id}`
    // })

    const { ContentType, Originalname }: { ContentType: string; Originalname: string } = req.body;

    const { url, key } = await createPresignedUploadLink({
      ContentType,
      Originalname,
      path: `users/${req.decoded?._id}`,
    });

    const user = await this.userModel.findByIdAndUpdate({
      id: req.user?._id as Types.ObjectId,
      update: {
        profileImage: key,
        temProfileImage: req.user?.temProfileImage,
      }
    });
    if (!user) {
      throw new BadRequestException("Fail to update user profile image")
    }

    s3Event.emit("trackProfileImageUpload", {
    userId: req.user?._id,
    oldKey: req.user?.profileImage,
    key,
    expiresIn: 30000
});

    return successResponse<IProfileImageResponse>({ res, data: { url } });
  };

  profileCoverImage = async (req: Request, res: Response): Promise<Response> => {
    const urls = await uploadFiles({
      storageApproach: StorageEnum.disk,
      files: req.files as Express.Multer.File[],
      path: `users/${req.decoded?._id}/cover`,
      useLarge: true
    })

    const user = await this.userModel.findByIdAndUpdate({
      id: req.user?._id as Types.ObjectId,
      update: {
        coverImages: urls,
      },
    });

    if (!user) {
      throw new BadRequestException("Fail to update profile cover images");
    };

    if (req.user?.coverImages) {
      await deleteFiles({ urls: req.user.coverImages });
    };

    return successResponse<IUserProfileResponse>({ res, data: { user } });
  };

  freezeAccount = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = (req.params as IFreezeAccountDTO) || {};
    if (userId && req.user?.role !== RoleEnum.admin) {
      throw new ForbiddenException("not authorized user");
    }

    const user = await this.userModel.updateOne({
      filter: {
        _id: userId || req.user?._id,
        freezedAt: { $exists: false },
      },
      update: {
        freezedAt: new Date(),
        freezedBy: req.user?._id,
        changeCredentialsTime: new Date(),
        $unset: {
          restoredAt: 1,
          restoredBy: 1,
        },
      },
    });
    
    if (!user.matchedCount) {
      throw new NotFoundException(
        "user not found or fail to delete this resource"
      );
    }
    
    return successResponse({ res });
  };

  restoreAccount = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = (req.params as IRestoreAccountDTO) || {};

    const user = await this.userModel.updateOne({
      filter: {
        _id: userId,
        freezedBy: { $ne: userId },
      },
      update: {
        restoredAt: new Date(),
        restoredBy: req.user?._id,
        $unset: {
          freezedAt: 1,
          freezedBy: 1,
        },
      },
    });
    
    if (!user.matchedCount) {
      throw new NotFoundException(
        "user not found or fail to restore this resource"
      );
    }
    
    return res.json({ message: "Done" });
  };

  hardDeleteAccount = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { userId } = req.params as IHardDeleteDTO;

    const user = await this.userModel.deleteOne({
      filter: {
        _id: userId,
        freezedat: { $exists: true },
      },
    });

    console.log({ user });

    if (!user.deletedCount) {
      throw new NotFoundException(
        "User not found or hard delete this resource"
      );
    }

    await deleteFolderByPrefix({ path: `users/${userId}` });
    return res.json({ message: "Done" });
  };

  logout = async (req: Request, res: Response): Promise<Response> => {
    const { flag }: ILogoutDto = req.body;

    let statusCode: number = 200;

    const update: UpdateQuery<IUser> = {};
    switch (flag) {
      case LogoutEnum.all:
        update.changeCredentialsTime = new Date();
        break;
      default:
        await createRevokeToken(req.decoded as JwtPayload)
        statusCode = 201;
        break;
    }
    await this.userModel.updateOne(
      {
        filter: { _id: req.decoded?._id },
        update
      }
    );

    return res.status(statusCode).json({
      message: "Done",
    });
  };

  refreshToken = async (req: Request, res: Response): Promise<Response> => {
    const credentials = await createLoginCredentials(req.user as HUserDocument);

    await createRevokeToken(req.decoded as JwtPayload);

    return successResponse<ILoginResponse>({ res, statusCode: 201, data: { credentials } });
  };

  //#GRAPHQL#

  welcome = (user: HUserDocument): string => {
    return "Hello graphql";
  };

  allUsers = async (args: { gender: GenderEnum }, authUser:HUserDocument): Promise<HUserDocument[]> => {
    return await this.userModel.find({
      filter: {
        _id: {$ne: authUser._id},
        gender: args.gender
      }
    });
  }

  search = (args: { email: string }): { message: string;  statusCode:number; data: IUser} => {
    const user = users.find((ele) => ele.email === args.email);
    if (!user) {
      throw new GraphQLError("fail to find matching result", {
        extensions: { statusCode: 404 },
      });
    }
    return { message: "Done", statusCode: 200, data: user };
  };

  addFollower = (args: { friendId: number; myId: number }): IUser[] => {
    users = users.map((ele: IUser): IUser => {
      if (ele.id === args.friendId) {
        ele.followers.push(args.myId)
      }
      return ele;
    });
    return users;
  };

}
export default new UserService();
