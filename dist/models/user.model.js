"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleEnum = exports.GenderEnum = void 0;
const mongoose_1 = require("mongoose");
var GenderEnum;
(function (GenderEnum) {
    GenderEnum["male"] = "male";
    GenderEnum["female"] = "female";
})(GenderEnum || (exports.GenderEnum = GenderEnum = {}));
var RoleEnum;
(function (RoleEnum) {
    RoleEnum["user"] = "user";
    RoleEnum["admin"] = "admin";
})(RoleEnum || (exports.RoleEnum = RoleEnum = {}));
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, min: 2, max: 20 },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
}, { timestamps: true });
const userModel = (0, mongoose_1.model)("User", userSchema);
exports.default = userModel;
//# sourceMappingURL=user.model.js.map