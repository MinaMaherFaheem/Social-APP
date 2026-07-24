import { Request, Response } from "express";
import { GenderEnum } from "../../models/user.model";
export interface IUser {
    id: number;
    name: string;
    email: string;
    gender: GenderEnum;
    password: string;
    followers: number[];
}
export declare class UserService {
    private userModel;
    private postModel;
    private chatModel;
    private friendRequestModel;
    constructor();
    profile: (req: Request, res: Response) => Promise<Response>;
    dashboard: (req: Request, res: Response) => Promise<Response>;
    changeRole: (req: Request, res: Response) => Promise<Response>;
    sendFriendRequest: (req: Request, res: Response) => Promise<Response>;
    acceptFriendRequest: (req: Request, res: Response) => Promise<Response>;
    profileImage: (req: Request, res: Response) => Promise<Response>;
    profileCoverImage: (req: Request, res: Response) => Promise<Response>;
    freezeAccount: (req: Request, res: Response) => Promise<Response>;
    restoreAccount: (req: Request, res: Response) => Promise<Response>;
    hardDeleteAccount: (req: Request, res: Response) => Promise<Response>;
    logout: (req: Request, res: Response) => Promise<Response>;
    refreshToken: (req: Request, res: Response) => Promise<Response>;
    wellcome: () => string;
    allUsers: (args: {
        name: string;
        gender: GenderEnum;
    }) => IUser[];
    search: (args: {
        email: string;
    }) => {
        message: string;
        statusCode: number;
        data: IUser;
    };
    addFollower: (args: {
        friendId: number;
        myId: number;
    }) => IUser[];
}
declare const _default: UserService;
export default _default;
//# sourceMappingURL=user.service.d.ts.map