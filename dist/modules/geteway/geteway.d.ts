import { Server } from "socket.io";
import { Server as HttpServer } from "node:http";
export declare let io: Server | undefined;
export declare const connectedSockets: Map<string, string>;
export declare const initio: (httpServer: HttpServer) => Promise<void>;
export declare const getIo: () => Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
//# sourceMappingURL=geteway.d.ts.map