"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPresignedUploadLink = exports.uploadLargeFile = exports.uploadFiles = exports.uploadFile = exports.s3Config = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const cloud_multer_1 = require("./cloud.multer");
const node_fs_1 = require("node:fs");
const uuid_1 = require("uuid");
const error_reponse_1 = require("../response/error.reponse");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3Config = () => {
    return new client_s3_1.S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });
};
exports.s3Config = s3Config;
const uploadFile = async ({ storageApproach = cloud_multer_1.StorageEnum.memory, Bucket = process.env.AWS_BUCKET_NAME, ACL = 'private', path = "general", file, }) => {
    const command = new client_s3_1.PutObjectCommand({
        Bucket,
        ACL,
        Key: `${process.env.APPLICATION_NAME}/${path}/${(0, uuid_1.v4)()}_${file.originalname}`,
        Body: storageApproach === cloud_multer_1.StorageEnum.memory
            ? file.buffer
            : (0, node_fs_1.createReadStream)(file.path),
        ContentType: file.mimetype,
    });
    await (0, exports.s3Config)().send(command);
    if (!command?.input?.Key) {
        throw new error_reponse_1.BadRequestException("fail to generate uploud key");
    }
    return command.input.Key;
};
exports.uploadFile = uploadFile;
const uploadFiles = async ({ storageApproach = cloud_multer_1.StorageEnum.memory, Bucket = process.env.AWS_BUCKET_NAME, ACL = 'private', path = "general", files, useLarge = false }) => {
    let urls = [];
    if (useLarge) {
        urls = await Promise.all(files.map((file) => {
            return (0, exports.uploadLargeFile)({
                file,
                path,
                ACL,
                Bucket,
                storageApproach,
            });
        }));
    }
    else {
        urls = await Promise.all(files.map((file) => {
            return (0, exports.uploadFile)({
                file,
                path,
                ACL,
                Bucket,
                storageApproach,
            });
        }));
    }
    ;
    return urls;
};
exports.uploadFiles = uploadFiles;
const uploadLargeFile = async ({ storageApproach = cloud_multer_1.StorageEnum.disk, Bucket = process.env.AWS_BUCKET_NAME, ACL = 'private', path = "general", file, }) => {
    const upload = new lib_storage_1.Upload({
        client: (0, exports.s3Config)(),
        params: {
            Bucket,
            ACL,
            Key: `${process.env.APPLICATION_NAME}/${path}/${(0, uuid_1.v4)()}_${file.originalname}`,
            Body: storageApproach === cloud_multer_1.StorageEnum.memory ? file.buffer : (0, node_fs_1.createReadStream)(file.path),
            ContentType: file.mimetype,
        },
    });
    upload.on("httpUploadProgress", (progress) => {
        console.log('Upload file progress is :::', progress);
    });
    const { Key } = await upload.done();
    if (!Key) {
        throw new error_reponse_1.BadRequestException("fail to generate uploud key");
    }
    return Key;
};
exports.uploadLargeFile = uploadLargeFile;
const createPresignedUploadLink = async ({ Bucket = process.env.AWS_BUCKET_NAME, path = "general", expiresIn = 120, ContentType, originalname, }) => {
    const command = new client_s3_1.PutObjectCommand({
        Bucket,
        Key: `${process.env.APPLICATION_NAME}/${path}/${(0, uuid_1.v4)()}_pre_${originalname}`,
        ContentType,
    });
    const url = await (0, s3_request_presigner_1.getSignedUrl)((0, exports.s3Config)(), command, { expiresIn });
    if (!url || !command?.input?.Key) {
        throw new error_reponse_1.BadRequestException("Fail to create pre signed url");
    }
    return { url, key: command.input.Key };
};
exports.createPresignedUploadLink = createPresignedUploadLink;
//# sourceMappingURL=s3.config.js.map