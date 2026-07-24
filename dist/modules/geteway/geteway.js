"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIo = exports.initio = exports.connectedSockets = exports.io = void 0;
const token_security_1 = require("./../../utils/security/token.security");
const socket_io_1 = require("socket.io");
const error_reponse_1 = require("../../utils/response/error.reponse");
const chat_1 = require("../chat");
exports.io = undefined;
exports.connectedSockets = new Map();
const initio = async (httpServer) => {
    const chatGeteway = new chat_1.ChatGeteway();
    exports.io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*"
        }
    });
    exports.io.use(async (socket, next) => {
        try {
            const { decoded, user } = await (0, token_security_1.decodeToken)({
                authorization: socket.handshake?.auth?.authorization,
                tokenType: token_security_1.TokenEnum.access
            });
            socket.credentials = { decoded, user };
            exports.connectedSockets.set(user._id.toString(), socket.id);
            next();
        }
        catch (error) {
            next(error);
        }
        ;
    });
    function disconnection(socket) {
        return socket.on("disconnect", () => {
            const removedUserId = socket.credentials?.user?._id.toString();
            exports.connectedSockets.delete(removedUserId);
            exports.io?.emit("offlineUser", { removedUserId });
        });
    }
    exports.io.on("connection", (socket) => {
        try {
            chatGeteway.register(socket, (0, exports.getIo)());
            disconnection(socket);
        }
        catch (error) {
            console.log("fail");
            socket.emit("custum_error", error);
        }
    });
};
exports.initio = initio;
const getIo = () => {
    if (!exports.io) {
        throw new error_reponse_1.BadRequestException("Socket Io server is not initialized yet !!!");
    }
    return exports.io;
};
exports.getIo = getIo;
//# sourceMappingURL=geteway.js.map