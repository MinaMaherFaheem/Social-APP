import { ChatService } from './chat.service';
import { IAuthSocket } from "../geteway";
import { Server } from "socket.io"


export class ChatEvents {
    private chatService : ChatService;
    constructor() {
        this.chatService = new ChatService();
    };

  sayHi = (socket: IAuthSocket, io: Server) => {
    return socket.on("sayHi", (message: string) => {
      try {
        return this.chatService.sayHi({ message, socket })
      } catch (error) {
        return socket.emit("custum_error", error)
      }
    })
  };

  sendMessage = (socket: IAuthSocket, io: Server) => {
    return socket.on("sendMessage", (data: { sendTo: string; content: string }) => {
      try {
        return this.chatService.sendMessage({ data, socket })
      } catch (error) {
        return socket.emit("custum_error", error)
      }
    })
  };

  sendGroupMessage = (socket: IAuthSocket, io: Server) => {
    return socket.on("sendGroupMessage", (data: { groupId: string; content: string }) => {
      try {
        return this.chatService.sendGroupMessage({ data, socket })
      } catch (error) {
        return socket.emit("custum_error", error)
      }
    })
  };

  joinRoom = (socket: IAuthSocket, io: Server) => {
    return socket.on("join_room", (data: { roomId: string }) => {
      try {
        return this.chatService.joinRoomGroup({ data, socket })
      } catch (error) {
        return socket.emit("custum_error", error)
      }
    })
  };

}