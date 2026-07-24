"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
{
    Request, Response;
}
from;
'express';
const mongoose_1 = require("mongoose");
const repository_1 = require("../../DB/repository");
const models_1 = require("../../models");
const geteway_1 = require("../geteway");
const error_reponse_1 = require("../../utils/response/error.reponse");
const success_response_1 = require("../../utils/response/success.response");
const uuid_1 = require("uuid");
const s3_config_1 = require("../../utils/multer/s3.config");
class ChatService {
    userModel = new repository_1.UserRepository(models_1.UserModel);
    chatModel = new repository_1.ChatRepository(models_1.ChatModel);
    constructor() { }
    getChat = async (req, res) => {
        const { userId } = req.params;
        const chat = await this.chatModel.findOneChat({
            filter: {
                group: { $exists: false },
                participants: { $all: [mongoose_1.Types.ObjectId.createFromHexString(userId), req.user?._id] },
            },
            page: req.query.page,
            size: req.query.size,
            options: {
                populate: [
                    {
                        path: "participants",
                    }
                ]
            }
        });
        if (!chat) {
            throw new error_reponse_1.NotFoundException("no matching result");
        }
        return (0, success_response_1.successResponse)({ res, data: { chat } });
    };
    getChattingGroup = async (req, res) => {
        const { groupId } = req.params;
        const chat = await this.chatModel.findOneChat({
            filter: {
                group: { $exists: true },
                participants: { $in: req.user?._id },
                _id: groupId
            },
            page: req.query.page,
            size: req.query.size,
            options: {
                populate: [
                    {
                        path: "participants",
                    },
                    {
                        path: "createdBy",
                    },
                    {
                        path: "messages.createdBy",
                    },
                ]
            }
        });
        if (!chat) {
            throw new error_reponse_1.NotFoundException("no matching result");
        }
        return (0, success_response_1.successResponse)({ res, data: { chat } });
    };
    createChattingGroup = async (req, res) => {
        const { userId } = req.body;
        const chackParticipants = await this.userModel.find({
            filter: {
                _id: { $in: req.body.participants },
                friends: { $in: req.user?._id },
            },
        });
        if (chackParticipants.length !== req.body.participants.length) {
            throw new error_reponse_1.NotFoundException("fail to find some participants");
        }
        let roomId = req.body.group.replaceAll(/\s+/g, "_") + "_" + (0, uuid_1.v4)();
        let group_image = undefined;
        if (req.file) {
            group_image = await (0, s3_config_1.uploadFile)({
                file: req.file,
                path: `chat/${roomId}`
            });
        }
        const [chat] = (await this.chatModel.create({
            data: [{
                    createdBy: req.user?._id,
                    group_image: group_image,
                    group: req.body.group,
                    roomId,
                    participants: [...req.body.participants, req.user?._id]
                }]
        })) || [];
        if (!chat) {
            throw new error_reponse_1.BadRequestException("fail to generate this chatting group");
        }
        return (0, success_response_1.successResponse)({ res, data: { chat }, statusCode: 201 });
    };
    sayHi = ({ message, socket }) => {
        console.log({ message });
    };
    sendMessage = async ({ data, socket }) => {
        const { content, sendTo } = data;
        const createdBy = socket.credentials?.user?._id;
        console.log({ content, sendTo, createdBy });
        const user = await this.userModel.findOne({
            filter: {
                _id: mongoose_1.Types.ObjectId.createFromHexString(sendTo),
                friends: { $in: createdBy }
            }
        });
        if (!user) {
            throw new error_reponse_1.NotFoundException("their is no matching friends");
        }
        let chat = undefined;
        chat = await this.chatModel.findOneAndUpdate({
            filter: {
                group: { $exists: false },
                participants: { $all: [mongoose_1.Types.ObjectId.createFromHexString(sendTo), createdBy] }
            },
            update: {
                $addToSet: { message: { content, createdBy } }
            }
        });
        if (!chat) {
            const [newChat] = (await this.chatModel.create({
                data: [
                    {
                        participants: [mongoose_1.Types.ObjectId.createFromHexString(sendTo), createdBy],
                        createdBy,
                        message: [{ content, createdBy }]
                    }
                ]
            })) || [];
            if (!newChat) {
                socket.emit("custom_error", "fail to send this message");
            }
            socket.emit("successMessage", { content });
            socket
                .to(geteway_1.connectedSockets
                .get(sendTo)).emit("newMessage", { content, from: socket.credentials?.user });
        }
    };
    sendGroupMessage = async ({ data, socket }) => {
        const { content, groupId } = data;
        const createdBy = socket.credentials?.user?._id;
        console.log({ content, groupId, createdBy });
        const group = await this.chatModel.findOneAndUpdate({
            filter: {
                _id: mongoose_1.Types.ObjectId.createFromHexString(groupId),
                group: { $exists: true },
                participants: { $in: createdBy }
            },
            update: {
                $addToSet: {
                    messages: { content, createdBy }
                }
            }
        });
        if (!group) {
            throw new error_reponse_1.NotFoundException("Fail to find matching group");
        }
        socket.emit("successMessage", { content });
        socket
            .to(group.roomId)
            .emit("newMessage", { content, from: socket.credentials?.user });
    };
    joinRoomGroup = async ({ data, socket }) => {
        const checkRoom = await this.chatModel.findOne({
            filter: {
                participants: {
                    $in: socket.credentials?.user?._id
                },
                roomId: data.roomId
            }
        });
        if (!checkRoom) {
            throw new error_reponse_1.NotFoundException("Fail to find matching room");
        }
        socket.join(data.roomId);
    };
}
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map