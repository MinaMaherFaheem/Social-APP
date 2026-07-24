"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const user_service_1 = require("./user.service");
class UserResolver {
    userService = new user_service_1.UserService();
    constructor() { }
    ;
    wellcome = (parent, args) => {
        return this.userService.wellcome();
    };
    allUsers = (parent, args) => {
        return this.userService.allUsers(args);
    };
    search = (parent, args) => {
        return this.userService.search(args);
    };
    addFollower = (parent, args) => {
        return this.userService.addFollower(args);
    };
}
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.resolver.js.map