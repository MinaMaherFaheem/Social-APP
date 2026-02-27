import { ObjectCannedACL, S3Client } from "@aws-sdk/client-s3";
import { StorageEnum } from "./cloud.multer";
export declare const s3Config: () => S3Client;
export declare const uploadFile: ({ storageApproach, Bucket, ACL, path, file, }: {
    storageApproach?: StorageEnum;
    Bucket?: string;
    ACL?: ObjectCannedACL;
    path?: string;
    file: Express.Multer.File;
}) => Promise<string>;
export declare const uploadFiles: ({ storageApproach, Bucket, ACL, path, files, useLarge }: {
    storageApproach?: StorageEnum;
    Bucket?: string;
    ACL?: ObjectCannedACL;
    path?: string;
    files: Express.Multer.File[];
    useLarge?: boolean;
}) => Promise<string[]>;
export declare const uploadLargeFile: ({ storageApproach, Bucket, ACL, path, file, }: {
    storageApproach?: StorageEnum;
    Bucket?: string;
    ACL?: ObjectCannedACL;
    path?: string;
    file: Express.Multer.File;
}) => Promise<string>;
export declare const createPresignedUploadLink: ({ Bucket, path, expiresIn, ContentType, originalname, }: {
    Bucket?: string;
    path?: string;
    expiresIn?: number;
    originalname: string;
    ContentType: string;
}) => Promise<{
    url: string;
    key: string;
}>;
//# sourceMappingURL=s3.config.d.ts.map