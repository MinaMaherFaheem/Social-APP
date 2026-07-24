"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChattingGroup = exports.getChattingGroup = exports.getChat = void 0;
const zod_1 = require("zod");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const cloud_multer_1 = require("../../utils/multer/cloud.multer");
exports.getChat = {
    params: zod_1.z.strictObject({
        userId: validation_middleware_1.generalFields.id
    })
};
exports.getChattingGroup = {
    params: zod_1.z.strictObject({
        groupId: validation_middleware_1.generalFields.id
    })
};
exports.createChattingGroup = {
    body: zod_1.z.strictObject({
        participants: zod_1.z.array(validation_middleware_1.generalFields.id).min(1).max(60),
        group: zod_1.z.string().min(2).max(100),
        attachments: validation_middleware_1.generalFields.file(cloud_multer_1.fileValidation.image).optional()
    }).superRefine((data, ctx) => {
        if (data.participants?.length &&
            data.participants.length !== [...new Set(data.participants)].length) {
            ctx.addIssue({
                code: "custom",
                path: ["participants"],
                message: "Duplicated participants users"
            });
        }
    })
};
//# sourceMappingURL=chat.validation.js.map