"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatEvents = void 0;
const chat_service_1 = require("./chat.service");
class ChatEvents {
    chatService;
    constructor() {
        this.chatService = new chat_service_1.ChatService();
    }
    ;
    sayHi = (socket, io) => {
        return socket.on("sayHi", (message) => {
            try {
                return this.chatService.sayHi({ message, socket });
            }
            catch (error) {
                return socket.emit("custum_error", error);
            }
        });
    };
    sendMessage = (socket, io) => {
        return socket.on("sendMessage", (data) => {
            try {
                return this.chatService.sendMessage({ data, socket });
            }
            catch (error) {
                return socket.emit("custum_error", error);
            }
        });
    };
    sendGroupMessage = (socket, io) => {
        return socket.on("sendGroupMessage", (data) => {
            try {
                return this.chatService.sendGroupMessage({ data, socket });
            }
            catch (error) {
                return socket.emit("custum_error", error);
            }
        });
    };
    joinRoom = (socket, io) => {
        return socket.on("join_room", (data) => {
            try {
                return this.chatService.joinRoomGroup({ data, socket });
            }
            catch (error) {
                return socket.emit("custum_error", error);
            }
        });
    };
}
exports.ChatEvents = ChatEvents;
//# sourceMappingURL=chat.events.js.map