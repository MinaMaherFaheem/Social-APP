"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../../models/user.model");
const user_repository_1 = require("../../DB/repository/user.repository");
const error_reponse_1 = require("../../utils/response/error.reponse");
const hash_security_1 = require("../../utils/security/hash.security");
const email_event_1 = require("../../utils/event/email.event");
const token_security_1 = require("../../utils/security/token.security");
const google_auth_library_1 = require("google-auth-library");
const otp_1 = require("../../utils/otp");
class AuthenticationService {
    userModel = new user_repository_1.UserRepository(user_model_1.UserModel);
    constructor() { }
    async verifyGmailAccount(idToken) {
        const client = new google_auth_library_1.OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.WEB_CLIENT_ID?.split(",") || [],
        });
        const payload = ticket.getPayload();
        if (!payload?.email_verified) {
            throw new error_reponse_1.BadRequestException("Fail to verify this google account");
        }
        return payload;
    }
    ;
    signupWithGmail = async (req, res) => {
        const { idToken } = req.body;
        const { email, family_name, given_name, picture } = await this.verifyGmailAccount(idToken);
        const user = await this.userModel.findOne({
            filter: {
                email,
            },
        });
        if (user) {
            if (user.provider == user_model_1.ProviderEnum.GOOGLE) {
                return await this.loginWithGmail(req, res);
            }
            throw new error_reponse_1.ConflictException('Email exist with another provider :: ' + user.provider);
        }
        const [newUser] = await this.userModel.create({
            data: [
                {
                    firstName: given_name,
                    lastName: family_name,
                    email: email,
                    profileImage: picture,
                    confirmedAt: new Date(),
                },
            ],
        }) || [];
        if (!newUser) {
            throw new error_reponse_1.BadRequestException("Fail to signup with gmail please try again later");
        }
        ;
        const credentials = await (0, token_security_1.createLoginCredentials)(newUser);
        return res.status(201).json({ message: "Done", data: { credentials } });
    };
    loginWithGmail = async (req, res) => {
        const { idToken } = req.body;
        const { email } = await this.verifyGmailAccount(idToken);
        const user = await this.userModel.findOne({
            filter: {
                email,
                provider: user_model_1.ProviderEnum.GOOGLE
            },
        });
        if (!user) {
            throw new error_reponse_1.NotFoundException("Not register account or registered with anther provider");
        }
        const credentials = await (0, token_security_1.createLoginCredentials)(user);
        return res.json({ message: "Done", data: { credentials } });
    };
    signup = async (req, res) => {
        let { username, email, password } = req.body;
        console.log({ username, email, password });
        const checkUserExist = await this.userModel.findOne({
            filter: { email },
            select: "email",
            options: {
                lean: false,
            }
        });
        console.log({ checkUserExist });
        if (checkUserExist) {
            throw new error_reponse_1.ConflictException("Email exist");
        }
        const otp = (0, otp_1.generateNumberOtp)();
        const user = await this.userModel.createUser({
            data: [{
                    username,
                    email,
                    password: await (0, hash_security_1.generateHash)(password),
                    confirmEmailOtp: await (0, hash_security_1.generateHash)(String(otp))
                }]
        });
        email_event_1.emailEvent.emit("confirmEmail", { to: email, otp });
        return res.status(201).json({ message: "Done", data: { user } });
    };
    confirmEmail = async (req, res) => {
        const { email, otp } = req.body;
        const user = await this.userModel.findOne({
            filter: {
                email,
                confirmEmailOtp: { $exists: true },
                confirmedAt: { $exists: false },
            },
        });
        if (!user) {
            throw new error_reponse_1.NotFoundException("Invalid account");
        }
        if (!(await (0, hash_security_1.compareHash)(otp, user.confirmEmailOtp))) {
            throw new error_reponse_1.ConflictException("Invalid confirmation code");
        }
        await this.userModel.updateOne({
            filter: {
                email
            },
            update: {
                confirmedAt: new Date(),
                $unset: {
                    confirmEmailOtp: 1
                }
            }
        });
        return res.json({ message: "Done", data: req.body });
    };
    login = async (req, res) => {
        const { email, password } = req.body;
        const user = await this.userModel.findOne({
            filter: { email, provider: user_model_1.ProviderEnum.SYSTEM },
        });
        if (!user) {
            throw new error_reponse_1.NotFoundException("invalid login data");
        }
        if (!user.confirmedAt) {
            throw new error_reponse_1.BadRequestException("Verify your account first");
        }
        if (!(await (0, hash_security_1.compareHash)(password, user.password))) {
            throw new error_reponse_1.NotFoundException("invalid login data");
        }
        const credentials = await (0, token_security_1.createLoginCredentials)(user);
        return res.json({
            message: "Done",
            data: { credentials },
        });
    };
    sendForgotCode = async (req, res) => {
        const { email } = req.body;
        const user = await this.userModel.findOne({
            filter: {
                email,
                provider: user_model_1.ProviderEnum.SYSTEM,
                confirmedAt: { $exists: true }
            },
        });
        if (!user) {
            throw new error_reponse_1.NotFoundException("invalid account due to one of the following reasons [not register , invalid provider , not confirmed account]");
        }
        const otp = (0, otp_1.generateNumberOtp)();
        const result = await this.userModel.updateOne({
            filter: { email },
            update: {
                resetPasswordOtp: await (0, hash_security_1.generateHash)(String(otp)),
            },
        });
        if (!result.matchedCount) {
            throw new error_reponse_1.BadRequestException("Fail to send the reset code please try again later");
        }
        ;
        email_event_1.emailEvent.emit("resetPassword", { to: email, otp });
        return res.json({
            message: "Done"
        });
    };
    verifyForgotPassword = async (req, res) => {
        const { email, otp } = req.body;
        const user = await this.userModel.findOne({
            filter: {
                email,
                provider: user_model_1.ProviderEnum.SYSTEM,
                resetPasswordOtp: { $exists: true }
            },
        });
        if (!user) {
            throw new error_reponse_1.NotFoundException("invalid account due to one of the following reasons [not register , invalid provider , not confirmed account , missing resetPasswordOtp]");
        }
        if (!await (0, hash_security_1.compareHash)(otp, user.resetPasswordOtp)) {
            throw new error_reponse_1.ConflictException("Invalid otp");
        }
        return res.json({
            message: "Done"
        });
    };
    resetForgotPassword = async (req, res) => {
        const { email, otp, password } = req.body;
        const user = await this.userModel.findOne({
            filter: {
                email,
                provider: user_model_1.ProviderEnum.SYSTEM,
                resetPasswordOtp: { $exists: true }
            },
        });
        if (!user) {
            throw new error_reponse_1.NotFoundException("invalid account due to one of the following reasons [not register , invalid provider , not confirmed account , missing resetPasswordOtp]");
        }
        if (!await (0, hash_security_1.compareHash)(otp, user.resetPasswordOtp)) {
            throw new error_reponse_1.ConflictException("Invalid otp");
        }
        const result = await this.userModel.updateOne({
            filter: { email },
            update: {
                password: await (0, hash_security_1.generateHash)(password),
                changeCredentialsTime: new Date(),
                $unset: { resetPasswordOtp: 1 }
            },
        });
        if (!result.matchedCount) {
            throw new error_reponse_1.BadRequestException("Fail to reset account password");
        }
        ;
        return res.json({
            message: "Done"
        });
    };
}
exports.default = new AuthenticationService();
//# sourceMappingURL=auth.service.js.map