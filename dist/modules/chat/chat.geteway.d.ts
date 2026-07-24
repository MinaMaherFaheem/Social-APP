import { IAuthSocket } from '../geteway';
import { Server } from "socket.io";
export declare class ChatGeteway {
    private chatEvents;
    constructor();
    register: (socket: IAuthSocket, io: Server) => void;
}
//# sourceMappingURL=chat.geteway.d.ts.map