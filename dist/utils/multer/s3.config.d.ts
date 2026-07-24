import { DeleteObjectCommandOutput, DeleteObjectsCommandOutput, GetObjectCommandOutput, ObjectCannedACL, S3Client } from "@aws-sdk/client-s3";
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
export declare const createPresignedUploadLink: ({ Bucket, path, expiresIn, ContentType, Originalname, }: {
    Bucket?: string;
    path?: string;
    expiresIn?: number;
    Originalname: string;
    ContentType: string;
}) => Promise<{
    url: string;
    key: string;
}>;
export declare const createGetPresignedLink: ({ Bucket, Key, expiresIn, downloadName, download }: {
    Bucket?: string;
    Key: string;
    expiresIn?: number;
    downloadName?: string;
    download?: string;
}) => Promise<string>;
export declare const getFile: ({ Bucket, Key }: {
    Bucket?: string;
    Key: string;
}) => Promise<GetObjectCommandOutput>;
export declare const deleteFile: ({ Bucket, Key, }: {
    Bucket?: string;
    Key: string;
}) => Promise<DeleteObjectCommandOutput>;
export declare const deleteFiles: ({ Bucket, urls, Quiet, }: {
    Bucket?: string;
    urls: string[];
    Quiet?: boolean;
}) => Promise<DeleteObjectsCommandOutput>;
export declare const listDirectoryFiles: ({ Bucket, path, }: {
    Bucket?: string;
    path: string;
}) => Promise<import("@aws-sdk/client-s3").ListObjectsV2CommandOutput>;
export declare const deleteFolderByPrefix: ({ Bucket, path, Quiet, }: {
    Bucket?: string;
    path: string;
    Quiet?: boolean;
}) => Promise<DeleteObjectsCommandOutput>;
//# sourceMappingURL=s3.config.d.ts.map