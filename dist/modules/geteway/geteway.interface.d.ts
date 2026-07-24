import { JwtPayload } from 'jsonwebtoken';
import { HUserDocument } from '../../models';
import { Socket } from "socket.io";
export interface ICredentials {
    user: HUserDocument;
    decoded: JwtPayload;
}
export interface IAuthSocket extends Socket {
    credentials?: ICredentials;
}
//# sourceMappingURL=geteway.interface.d.ts.map