import { z } from "zod";
export declare const getChat: {
    params: z.ZodObject<{
        userId: z.ZodString;
    }, z.core.$strict>;
};
export declare const getChattingGroup: {
    params: z.ZodObject<{
        groupId: z.ZodString;
    }, z.core.$strict>;
};
export declare const createChattingGroup: {
    body: z.ZodObject<{
        participants: z.ZodArray<z.ZodString>;
        group: z.ZodString;
        attachments: z.ZodOptional<z.ZodObject<{
            fieldname: z.ZodString;
            originalname: z.ZodString;
            encoding: z.ZodString;
            mimetype: z.ZodEnum<{
                [x: string]: string;
            }>;
            buffer: z.ZodOptional<z.ZodAny>;
            path: z.ZodOptional<z.ZodString>;
            size: z.ZodNumber;
        }, z.core.$strict>>;
    }, z.core.$strict>;
};
//# sourceMappingURL=chat.validation.d.ts.map