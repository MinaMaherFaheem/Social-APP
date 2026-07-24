import { IAuthSocket } from '../geteway';
export declare class ChatService {
    private userModel;
    private chatModel;
    constructor();
    getChat: (req: Request, res: Response) => Promise<Response>;
    getChattingGroup: (req: Request, res: Response) => Promise<Response>;
    createChattingGroup: (req: Request, res: Response) => Promise<Response>;
    sayHi: ({ message, socket }: {
        message: string;
        socket: IAuthSocket;
    }) => void;
    sendMessage: ({ data, socket }: {
        data: {
            sendTo: string;
            content: string;
        };
        socket: IAuthSocket;
    }) => Promise<void>;
    sendGroupMessage: ({ data, socket }: {
        data: {
            groupId: string;
            content: string;
        };
        socket: IAuthSocket;
    }) => Promise<void>;
    joinRoomGroup: ({ data, socket }: {
        data: {
            roomId: string;
        };
        socket: IAuthSocket;
    }) => Promise<void>;
}
//# sourceMappingURL=chat.service.d.ts.map