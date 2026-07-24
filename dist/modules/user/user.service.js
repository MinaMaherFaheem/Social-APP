"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("../../DB/repository/user.repository");
const user_model_1 = require("../../models/user.model");
const token_security_1 = require("../../utils/security/token.security");
const s3_config_1 = require("../../utils/multer/s3.config");
const cloud_multer_1 = require("../../utils/multer/cloud.multer");
const error_reponse_1 = require("../../utils/response/error.reponse");
const s3_events_1 = require("../../utils/multer/s3.events");
const success_response_1 = require("../../utils/response/success.response");
const repository_1 = require("../../DB/repository");
const models_1 = require("../../models");
const graphql_1 = require("graphql");
let users = [
    {
        id: 1,
        name: "mina",
        email: "mina@gmail.com",
        gender: user_model_1.GenderEnum.male,
        password: "12345",
        followers: [],
    },
    {
        id: 2,
        name: "maher",
        email: "maher@gmail.com",
        gender: user_model_1.GenderEnum.male,
        password: "112233",
        followers: [],
    },
    {
        id: 3,
        name: "faheem",
        email: "faheem@gmail.com",
        gender: user_model_1.GenderEnum.male,
        password: "112211",
        followers: [],
    },
    {
        id: 4,
        name: "ayoub",
        email: "ayoub@gmail.com",
        gender: user_model_1.GenderEnum.male,
        password: "232422",
        followers: [],
    },
];
class UserService {
    userModel = new user_repository_1.UserRepository(user_model_1.UserModel);
    postModel = new repository_1.PostRepository(models_1.PostModel);
    chatModel = new repository_1.ChatRepository(models_1.ChatModel);
    friendRequestModel = new repository_1.FriendRequestRepository(models_1.FriendRequestModel);
    constructor() { }
    profile = async (req, res) => {
        const profile = await this.userModel.findById({
            id: req.user?._id,
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
            throw new error_reponse_1.NotFoundException("fail to find user profile");
        }
        ;
        const groups = await this.chatModel.find({
            filter: {
                participants: { $in: req.user?._id },
                group: { $exists: true }
            },
        });
        return (0, success_response_1.successResponse)({ res, data: { user: profile, groups } });
    };
    dashboard = async (req, res) => {
        const results = await Promise.allSettled([
            this.userModel.find({ filter: {} }),
            this.postModel.find({ filter: {} })
        ]);
        return (0, success_response_1.successResponse)({ res, data: { results } });
    };
    changeRole = async (req, res) => {
        const { userId } = req.params;
        const { role } = req.body;
        const denyRoles = [role, user_model_1.RoleEnum.superAdmin];
        if (req.user?.role === user_model_1.RoleEnum.admin) {
            denyRoles.push(user_model_1.RoleEnum.admin);
        }
        const user = await this.userModel.findOneAndUpdate({
            filter: {
                _id: userId,
                role: { $nin: denyRoles }
            },
            update: {
                role
            }
        });
        if (!user) {
            throw new error_reponse_1.NotFoundException("fail to find matching result");
        }
        ;
        return (0, success_response_1.successResponse)({ res });
    };
    sendFriendRequest = async (req, res) => {
        const { userId } = req.params;
        const checkFriendRequestExist = await this.friendRequestModel.findOne({
            filter: {
                createdBy: { $in: [req.user?._id, userId] },
                sendTo: { $in: [req.user?._id, userId] }
            }
        });
        if (checkFriendRequestExist) {
            throw new error_reponse_1.ConflictException("Friend request already exist");
        }
        const user = await this.userModel.findOne({
            filter: {
                _id: userId
            }
        });
        if (!user) {
            throw new error_reponse_1.NotFoundException("Invalid recipient");
        }
        const [friendRequest] = (await this.friendRequestModel.create({
            data: [
                {
                    createdBy: req.user?._id,
                    sendTo: userId
                }
            ]
        })) || [];
        if (!friendRequest) {
            throw new error_reponse_1.BadRequestException("something went wrong!!!");
        }
        return (0, success_response_1.successResponse)({ res, statusCode: 201 });
    };
    acceptFriendRequest = async (req, res) => {
        const { requestId } = req.params;
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
            throw new error_reponse_1.NotFoundException("Fail to found matching result");
        }
        ;
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
        ]);
        return (0, success_response_1.successResponse)({ res });
    };
    profileImage = async (req, res) => {
        const { ContentType, Originalname } = req.body;
        const { url, key } = await (0, s3_config_1.createPresignedUploadLink)({
            ContentType,
            Originalname,
            path: `users/${req.decoded?._id}`,
        });
        const user = await this.userModel.findByIdAndUpdate({
            id: req.user?._id,
            update: {
                profileImage: key,
                temProfileImage: req.user?.temProfileImage,
            }
        });
        if (!user) {
            throw new error_reponse_1.BadRequestException("Fail to update user profile image");
        }
        s3_events_1.s3Event.emit("trackProfileImageUpload", {
            userId: req.user?._id,
            oldKey: req.user?.profileImage,
            key,
            expiresIn: 30000
        });
        return (0, success_response_1.successResponse)({ res, data: { url } });
    };
    profileCoverImage = async (req, res) => {
        const urls = await (0, s3_config_1.uploadFiles)({
            storageApproach: cloud_multer_1.StorageEnum.disk,
            files: req.files,
            path: `users/${req.decoded?._id}/cover`,
            useLarge: true
        });
        const user = await this.userModel.findByIdAndUpdate({
            id: req.user?._id,
            update: {
                coverImages: urls,
            },
        });
        if (!user) {
            throw new error_reponse_1.BadRequestException("Fail to update profile cover images");
        }
        ;
        if (req.user?.coverImages) {
            await (0, s3_config_1.deleteFiles)({ urls: req.user.coverImages });
        }
        ;
        return (0, success_response_1.successResponse)({ res, data: { user } });
    };
    freezeAccount = async (req, res) => {
        const { userId } = req.params || {};
        if (userId && req.user?.role !== user_model_1.RoleEnum.admin) {
            throw new error_reponse_1.ForbiddenException("not authorized user");
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
            throw new error_reponse_1.NotFoundException("user not found or fail to delete this resource");
        }
        return (0, success_response_1.successResponse)({ res });
    };
    restoreAccount = async (req, res) => {
        const { userId } = req.params || {};
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
            throw new error_reponse_1.NotFoundException("user not found or fail to restore this resource");
        }
        return res.json({ message: "Done" });
    };
    hardDeleteAccount = async (req, res) => {
        const { userId } = req.params;
        const user = await this.userModel.deleteOne({
            filter: {
                _id: userId,
                freezedat: { $exists: true },
            },
        });
        console.log({ user });
        if (!user.deletedCount) {
            throw new error_reponse_1.NotFoundException("User not found or hard delete this resource");
        }
        await (0, s3_config_1.deleteFolderByPrefix)({ path: `users/${userId}` });
        return res.json({ message: "Done" });
    };
    logout = async (req, res) => {
        const { flag } = req.body;
        let statusCode = 200;
        const update = {};
        switch (flag) {
            case token_security_1.LogoutEnum.all:
                update.changeCredentialsTime = new Date();
                break;
            default:
                await (0, token_security_1.createRevokeToken)(req.decoded);
                statusCode = 201;
                break;
        }
        await this.userModel.updateOne({
            filter: { _id: req.decoded?._id },
            update
        });
        return res.status(statusCode).json({
            message: "Done",
        });
    };
    refreshToken = async (req, res) => {
        const credentials = await (0, token_security_1.createLoginCredentials)(req.user);
        await (0, token_security_1.createRevokeToken)(req.decoded);
        return (0, success_response_1.successResponse)({ res, statusCode: 201, data: { credentials } });
    };
    wellcome = () => {
        return "Hello graphql";
    };
    allUsers = (args) => {
        return users.filter((ele) => {
            ele.name === args.name && ele.gender === args.gender;
        });
    };
    search = (args) => {
        const user = users.find((ele) => ele.email === args.email);
        if (!user) {
            throw new graphql_1.GraphQLError("fail to find matching result", {
                extensions: { statusCode: 404 },
            });
        }
        return { message: "Done", statusCode: 200, data: user };
    };
    addFollower = (args) => {
        users = users.map((ele) => {
            if (ele.id === args.friendId) {
                ele.followers.push(args.myId);
            }
            return ele;
        });
        return users;
    };
}
exports.UserService = UserService;
exports.default = new UserService();
//# sourceMappingURL=user.service.js.map