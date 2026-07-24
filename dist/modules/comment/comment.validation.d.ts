import { z } from "zod";
export declare const createComment: {
    params: z.ZodObject<{
        postId: z.ZodString;
    }, z.core.$strict>;
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
        tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>;
};
export declare const replyOnComment: {
    params: z.ZodObject<{
        postId: z.ZodString;
        commentId: z.ZodString;
    }, z.core.$strict>;
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
        tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>;
};
//# sourceMappingURL=comment.validation.d.ts.map