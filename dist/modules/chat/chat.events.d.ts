import { IAuthSocket } from "../geteway";
import { Server } from "socket.io";
export declare class ChatEvents {
    private chatService;
    constructor();
    sayHi: (socket: IAuthSocket, io: Server) => IAuthSocket;
    sendMessage: (socket: IAuthSocket, io: Server) => IAuthSocket;
    sendGroupMessage: (socket: IAuthSocket, io: Server) => IAuthSocket;
    joinRoom: (socket: IAuthSocket, io: Server) => IAuthSocket;
}
//# sourceMappingURL=chat.events.d.ts.map