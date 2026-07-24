import {z} from "zod";
import { generalFields } from "../../middleware/validation.middleware";
import { fileValidation } from "../../utils/multer/cloud.multer";


export const getChat = {
  params: z.strictObject({
      userId: generalFields.id
    })
};

export const getChattingGroup = {
  params: z.strictObject({
      groupId: generalFields.id
    })
};

export const createChattingGroup = {
  body: z.strictObject({
      participants: z.array(generalFields.id).min(1).max(60),
      group: z.string().min(2).max(100),
      attachments: generalFields.file(fileValidation.image).optional()
    }).superRefine((data, ctx) => {
      if (
        data.participants?.length &&
        data.participants.length !== [...new Set(data.participants)].length
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["participants"],
          message: "Duplicated participants users"
        })
      }
    })
};
