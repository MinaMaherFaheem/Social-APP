import type { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { HUserDocument, RoleEnum } from "../../models/user.model";
import { HTokenDocument } from '../../models/token.model';
export declare enum SignatureLevelEnum {
    Bearer = "Bearer",
    System = "System"
}
export declare enum TokenEnum {
    access = "access",
    refresh = "refresh"
}
export declare enum LogoutEnum {
    only = "only",
    all = "all"
}
export declare const generateToken: ({ payload, secret, options, }: {
    payload: object;
    secret?: Secret;
    options?: SignOptions;
}) => Promise<string>;
export declare const verifyToken: ({ token, secret, }: {
    token: string;
    secret?: Secret;
}) => Promise<JwtPayload>;
export declare const detectSignatureLevel: (role?: RoleEnum) => Promise<SignatureLevelEnum>;
export declare const getSignatures: (signatureLevel?: SignatureLevelEnum) => Promise<{
    access_signature: string;
    refresh_signature: string;
}>;
export declare const createLoginCredentials: (user: HUserDocument) => Promise<{
    access_token: string;
    refresh_token: string;
}>;
export declare const decodeToken: ({ authorization, tokenType, }: {
    authorization: string;
    tokenType?: TokenEnum;
}) => Promise<{
    user: (import("mongoose").Document<unknown, {}, import("../../models/user.model").IUser, {}, {}> & import("../../models/user.model").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | (import("mongoose").Document<unknown, {}, import("mongoose").FlattenMaps<import("../../models/user.model").IUser>, {}, {}> & import("mongoose").FlattenMaps<import("../../models/user.model").IUser> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    });
    decoded: JwtPayload;
}>;
export declare const createRevokeToken: (decoded: JwtPayload) => Promise<HTokenDocument>;
//# sourceMappingURL=token.security.d.ts.map