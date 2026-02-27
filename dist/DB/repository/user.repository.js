"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_repository_1 = require("./database.repository");
const error_reponse_1 = require("../../utils/response/error.reponse");
class UserRepository extends database_repository_1.DatabaseRepository {
    model;
    constructor(model) {
        super(model);
        this.model = model;
    }
    async createUser({ data, options, }) {
        const [user] = (await this.create({ data })) || [];
        if (!user) {
            throw new error_reponse_1.BadRequestException("Fail to create this user");
        }
        return user;
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map