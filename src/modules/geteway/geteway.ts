import { decodeToken, TokenEnum } from './../../utils/security/token.security';
import { Server } from "socket.io"
import { Server as HttpServer } from "node:http"
import { IAuthSocket } from './geteway.interface';
import { BadRequestException } from '../../utils/response/error.reponse';
import { ChatGeteway } from '../chat';

export let io:Server | undefined = undefined;

export const connectedSockets = new Map<string, string>()


export const initio = async(httpServer: HttpServer) => {
  const chatGeteway : ChatGeteway = new ChatGeteway();
    io = new Server(httpServer, {
        cors: {
          origin: "*"
        }
      });
    
      io.use(async(socket: IAuthSocket, next) => {
        try {
          const { decoded, user } = await decodeToken({
            authorization: socket.handshake?.auth?.authorization as string,
            tokenType: TokenEnum.access
          });
          socket.credentials = { decoded, user };
          connectedSockets.set(user._id.toString() , socket.id)
          next();
        } catch (error:any) {
          next(error);
        };
      });

      function disconnection (socket: IAuthSocket) {
        return socket.on("disconnect", () => {
            const removedUserId = socket.credentials?.user?._id.toString() as string
            connectedSockets.delete(removedUserId);
            io?.emit("offlineUser", {removedUserId})
        })
      }
    
      io.on("connection", (socket: IAuthSocket) => {
        try {
          chatGeteway.register(socket, getIo())
          disconnection(socket);
        } catch (error) {
          console.log("fail");
          socket.emit("custum_error", error)
        }
      });
}

export const getIo = ()=>{
  if (!io) {
    throw new BadRequestException("Socket Io server is not initialized yet !!!");
  }
  return io;
};
