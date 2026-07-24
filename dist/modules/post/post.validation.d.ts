import { z } from "zod";
import { AllowCommentsEnum, AvailabilityEnum, LikeActionEnum } from "../../models/post.model";
export declare const createPost: {
    body: z.ZodObject<{
        content: z.ZodOptional<z.ZodString>;
        attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            fieldname: z.ZodString;
            originalname: z.ZodString;
            encoding: z.ZodString;
            mimetype: z.ZodEnum<{
                [x: string]: string;
            }>;
            buffer: z.ZodOptional<z.ZodAny>;
            path: z.ZodOptional<z.ZodString>;
            size: z.ZodNumber;
        }, z.core.$strict>>>;
        availability: z.ZodDefault<z.ZodEnum<typeof AvailabilityEnum>>;
        allowComments: z.ZodDefault<z.ZodEnum<typeof AllowCommentsEnum>>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>;
};
export declare const updatePost: {
    params: z.ZodObject<{
        postId: z.ZodString;
    }, z.core.$strict>;
    body: z.ZodObject<{
        content: z.ZodOptional<z.ZodString>;
        availability: z.ZodOptional<z.ZodEnum<typeof AvailabilityEnum>>;
        allowComments: z.ZodOptional<z.ZodEnum<typeof AllowCommentsEnum>>;
        attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            fieldname: z.ZodString;
            originalname: z.ZodString;
            encoding: z.ZodString;
            mimetype: z.ZodEnum<{
                [x: string]: string;
            }>;
            buffer: z.ZodOptional<z.ZodAny>;
            path: z.ZodOptional<z.ZodString>;
            size: z.ZodNumber;
        }, z.core.$strict>>>;
        removedAttachments: z.ZodOptional<z.ZodArray<z.ZodString>>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
        removedTags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>;
};
export declare const likePost: {
    params: z.ZodObject<{
        postId: z.ZodString;
    }, z.core.$strict>;
    query: z.ZodObject<{
        action: z.ZodDefault<z.ZodEnum<typeof LikeActionEnum>>;
    }, z.core.$strict>;
};
//# sourceMappingURL=post.validation.d.ts.map