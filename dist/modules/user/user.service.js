"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_1 = require("../../DB/repository/user.repository");
const user_model_1 = require("../../models/user.model");
const token_security_1 = require("../../utils/security/token.security");
const s3_config_1 = require("../../utils/multer/s3.config");
const cloud_multer_1 = require("../../utils/multer/cloud.multer");
class UserService {
    userModel = new user_repository_1.UserRepository(user_model_1.UserModel);
    constructor() { }
    profile = async (req, res) => {
        return res.json({
            message: "Done",
            data: {
                file: req.file
            }
        });
    };
    profileImage = async (req, res) => {
        const { ContentType, originalname } = req.body;
        const { url, key } = await (0, s3_config_1.createPresignedUploadLink)({
            ContentType,
            originalname,
            path: `users/${req.decoded?._id}`,
        });
        return res.json({
            message: "Done",
            data: {
                url,
                key
            },
        });
    };
    profileCoverImage = async (req, res) => {
        const urls = await (0, s3_config_1.uploadFiles)({
            storageApproach: cloud_multer_1.StorageEnum.disk,
            files: req.files,
            path: `users/${req.decoded?._id}/cover`,
            useLarge: true
        });
        return res.json({
            message: "Done",
            data: {
                urls
            },
        });
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
        return res.status(201).json({ message: "Done", data: { credentials } });
    };
}
exports.default = new UserService();
//# sourceMappingURL=user.service.js.map