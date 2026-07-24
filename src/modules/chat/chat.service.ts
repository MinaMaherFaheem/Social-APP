import types { Request, Response } from 'express';
import { Types } from 'mongoose';
import { ChatRepository, UserRepository } from '../../DB/repository';
import { ChatModel, UserModel } from '../../models';
import { connectedSockets, IAuthSocket } from '../geteway';
import { BadRequestException, NotFoundException } from '../../utils/response/error.reponse';
import { successResponse } from '../../utils/response/success.response';
import { v4 as uuid } from "uuid"
import { uploadFile } from '../../utils/multer/s3.config';


export class ChatService {
    private userModel = new UserRepository(UserModel);
    private chatModel = new ChatRepository(ChatModel);
    constructor(){}

    getChat = async (req:Request, res: Response): Promise<Response> => {
       const { userId } = req.params as unknown as { userId: string };
        
       const chat = await this.chatModel.findOneChat({
        filter: {
            group: { $exists: false },
            participants: { $all: [Types.ObjectId.createFromHexString(userId) , req.user?._id] },
        },
        page: req.query.page as unknown as number,
        size: req.query.size as unknown as number,
        options: {
            populate: [
                {
                    path: "participants",
                }
            ]
        }
       })
       if (!chat) {
        throw new NotFoundException("no matching result")
       }

        return successResponse({ res, data: { chat } });
    }

    getChattingGroup = async (req:Request, res: Response): Promise<Response> => {
       const { groupId } = req.params as unknown as { groupId: string };
        
       const chat = await this.chatModel.findOneChat({
        filter: {
            group: { $exists: true },
            participants: { $in: req.user?._id },
            _id: groupId
        },
        page: req.query.page as unknown as number,
        size: req.query.size as unknown as number,
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
       })
       if (!chat) {
        throw new NotFoundException("no matching result")
       }

        return successResponse({ res, data: { chat } });
    }

    createChattingGroup = async (req:Request, res: Response): Promise<Response> => {
        const { userId } = req.body;
         
        const chackParticipants = await this.userModel.find({
         filter: {
             _id: { $in: req.body.participants },
             friends: { $in: req.user?._id },
         },
        })
        if (chackParticipants.length !== req.body.participants.length) {
         throw new NotFoundException("fail to find some participants")
        }

        let roomId = req.body.group.replaceAll(/\s+/g,"_") + "_" + uuid();
        let group_image:string | undefined = undefined;
        if(req.file) {
            group_image = await uploadFile({
                file: req.file as Express.Multer.File,
                path: `chat/${roomId}`
            })
        }

        const [chat] = (await this.chatModel.create({
            data:[{
                createdBy: req.user?._id as Types.ObjectId,
                group_image: group_image as string,
                group: req.body.group,
                roomId,
                participants: [...req.body.participants, req.user?._id]
            }]
        })) || [];
        if (!chat) {
            throw new BadRequestException("fail to generate this chatting group")
        }
 
         return successResponse({ res, data: { chat }, statusCode:201 });
     }
    
    sayHi = ({ message, socket }:{ message: string; socket: IAuthSocket; }) => {
        console.log({ message });
    }

    sendMessage = async ({ data, socket }:{ data: { sendTo:string; content:string }; socket: IAuthSocket; }) => {
        const { content, sendTo } = data;
        const createdBy = socket.credentials?.user?._id as Types.ObjectId;
        console.log({ content, sendTo, createdBy });

        const user = await this.userModel.findOne({
            filter: {
                _id: Types.ObjectId.createFromHexString(sendTo),
                friends: { $in: createdBy }
            }
        })

        if(!user) {
            throw new NotFoundException("their is no matching friends")
        }


        let chat = undefined;
        chat = await this.chatModel.findOneAndUpdate({
            filter: {
                group: { $exists: false },
                participants: { $all: [Types.ObjectId.createFromHexString(sendTo) , createdBy] }
            },
            update: {
                $addToSet: { message: { content, createdBy } }
            }
        })

        if (!chat) {
            const [newChat] = (await this.chatModel.create({
                data: [
                    {
                        participants: [Types.ObjectId.createFromHexString(sendTo) , createdBy],
                        createdBy,
                        message: [{ content , createdBy }]
                    }
                ]
            }))|| [];
            if (!newChat) {
                socket.emit("custom_error","fail to send this message")
            }

            socket.emit("successMessage", { content })
            socket
                .to(connectedSockets
                .get(sendTo) as string).emit("newMessage", { content, from: socket.credentials?.user })

        }

    }

    sendGroupMessage = async ({ data, socket }:{ data: { groupId:string; content:string }; socket: IAuthSocket; }) => {
        const { content, groupId } = data;
        const createdBy = socket.credentials?.user?._id as Types.ObjectId;
        console.log({ content, groupId, createdBy });

        const group = await this.chatModel.findOneAndUpdate({
            filter: {
                _id: Types.ObjectId.createFromHexString(groupId),
                group: { $exists: true },
                participants: {$in: createdBy}
            },
            update: {
                $addToSet: {
                    messages: { content, createdBy }
                }
            }
        })

        if(!group) {
            throw new NotFoundException("Fail to find matching group")
        }

        socket.emit("successMessage", { content })
        socket
            .to(group.roomId as string)
            .emit("newMessage", { content, from: socket.credentials?.user })

    }

    joinRoomGroup = async ({ data, socket }:{ data: { roomId:string}; socket: IAuthSocket; }) => {

        const checkRoom = await this.chatModel.findOne({
            filter: {
                participants: {
                    $in: socket.credentials?.user?._id
                },
                roomId: data.roomId
            }
        })

        if(!checkRoom) {
            throw new NotFoundException("Fail to find matching room")
        }

        socket.join(data.roomId);

    }

}