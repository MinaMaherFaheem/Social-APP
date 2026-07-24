import { GenderEnum } from "../../models";
import { IUser } from "./user.service";
export declare class UserResolver {
    private userService;
    constructor();
    wellcome: (parent: unknown, args: any) => string;
    allUsers: (parent: unknown, args: {
        name: string;
        gender: GenderEnum;
    }) => IUser[];
    search: (parent: unknown, args: {
        email: string;
    }) => {
        message: string;
        statusCode: number;
        data: IUser;
    };
    addFollower: (parent: unknown, args: {
        friendId: number;
        myId: number;
    }) => IUser[];
}
//# sourceMappingURL=user.resolver.d.ts.map