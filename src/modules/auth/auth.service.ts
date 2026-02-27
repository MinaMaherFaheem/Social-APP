import type { Request, Response } from "express";
import type {
  ISignupBodyInputDTO,
  IConfirmEmailBodyInputDTO,
  ILoginBodyInputDTO,
  IGmail,
  IForgotCodeBodyInputDTO,
  IVerifyForgotPasswordBodyInputDTO,
  IResetForgotPasswordBodyInputDTO,
} from "./auth.dto";
import { ProviderEnum, UserModel } from "../../models/user.model";
import { UserRepository } from "../../DB/repository/user.repository";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "../../utils/response/error.reponse";
import { compareHash, generateHash } from "../../utils/security/hash.security";
import { emailEvent } from "../../utils/email/email.event";
import { createLoginCredentials } from "../../utils/security/token.security";
import { OAuth2Client, type TokenPayload } from "google-auth-library";
import { generateNumberOtp } from "../../utils/otp";
import { successResponse } from "../../utils/response/success.response";
import { ILoginResponse } from "./auth.entities";

class AuthenticationService {
  private userModel = new UserRepository(UserModel);
  constructor() {}

  private async verifyGmailAccount(idToken: string): Promise<TokenPayload> {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.WEB_CLIENT_ID?.split(",") || [],
    });

    const payload = ticket.getPayload();
    if (!payload?.email_verified) {
      throw new BadRequestException("Fail to verify this google account");
    }

    return payload;
  }

  signupWithGmail = async (req: Request, res: Response): Promise<Response> => {
    const { idToken }: IGmail = req.body;
    const { email, family_name, given_name, picture } =
      await this.verifyGmailAccount(idToken);

    const user = await this.userModel.findOne({
      filter: {
        email,
      },
    });

    if (user) {
      if (user.provider == ProviderEnum.GOOGLE) {
        return await this.loginWithGmail(req, res);
      }
      throw new ConflictException(
        "Email exist with another provider :: " + user.provider,
      );
    }

    const [newUser] =
      (await this.userModel.create({
        data: [
          {
            firstName: given_name as string,
            lastName: family_name as string,
            email: email as string,
            profileImage: picture as string,
            confirmedAt: new Date(),
          },
        ],
      })) || [];

    if (!newUser) {
      throw new BadRequestException(
        "Fail to signup with gmail please try again later",
      );
    }

    const credentials = await createLoginCredentials(newUser);

    return successResponse<ILoginResponse>({ res,  statusCode:201, data: { credentials } });
  };

  loginWithGmail = async (req: Request, res: Response): Promise<Response> => {
    const { idToken }: IGmail = req.body;
    const { email } = await this.verifyGmailAccount(idToken);

    const user = await this.userModel.findOne({
      filter: {
        email,
        provider: ProviderEnum.GOOGLE,
      },
    });

    if (!user) {
      throw new NotFoundException(
        "Not register account or registered with anther provider",
      );
    }

    const credentials = await createLoginCredentials(user);

    return successResponse<ILoginResponse>({ res, data: { credentials } });
  };

  signup = async (req: Request, res: Response): Promise<Response> => {
    let { username, email, password }: ISignupBodyInputDTO = req.body;
    console.log({ username, email, password });

    const checkUserExist = await this.userModel.findOne({
      filter: { email },
      select: "email",
      options: {
        lean: false,
      },
    });

    if (checkUserExist) {
      throw new ConflictException("Email exist");
    }

    const otp = generateNumberOtp();

    await this.userModel.createUser({
      data: [
        {
          username,
          email,
          password: await generateHash(password),
          confirmEmailOtp: await generateHash(String(otp)),
        },
      ],
    });

    emailEvent.emit("confirmEmail", { to: email, otp });

    return successResponse({ res, statusCode: 201 });
  };

  confirmEmail = async (req: Request, res: Response): Promise<Response> => {
    const { email, otp }: IConfirmEmailBodyInputDTO = req.body;

    const user = await this.userModel.findOne({
      filter: {
        email,
        confirmEmailOtp: { $exists: true },
        confirmedAt: { $exists: false },
      },
    });

    if (!user) {
      throw new NotFoundException("Invalid account");
    }

    if (!(await compareHash(otp, user.confirmEmailOtp as string))) {
      throw new ConflictException("Invalid confirmation code");
    }

    await this.userModel.updateOne({
      filter: {
        email,
      },
      update: {
        confirmedAt: new Date(),
        $unset: {
          confirmEmailOtp: 1,
        },
      },
    });

    return successResponse({ res });
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password }: ILoginBodyInputDTO = req.body;

    const user = await this.userModel.findOne({
      filter: { email, provider: ProviderEnum.SYSTEM },
    });

    if (!user) {
      throw new NotFoundException("invalid login data");
    }

    if (!user.confirmedAt) {
      throw new BadRequestException("Verify your account first");
    }

    if (!(await compareHash(password, user.password))) {
      throw new NotFoundException("invalid login data");
    }

    const credentials = await createLoginCredentials(user);

    return successResponse<ILoginResponse>({ res, data: { credentials } });
  };

  sendForgotCode = async (req: Request, res: Response): Promise<Response> => {
    const { email }: IForgotCodeBodyInputDTO = req.body;

    const user = await this.userModel.findOne({
      filter: {
        email,
        provider: ProviderEnum.SYSTEM,
        confirmedAt: { $exists: true },
      },
    });

    if (!user) {
      throw new NotFoundException(
        "invalid account due to one of the following reasons [not register , invalid provider , not confirmed account]",
      );
    }

    const otp = generateNumberOtp();
    const result = await this.userModel.updateOne({
      filter: { email },
      update: {
        resetPasswordOtp: await generateHash(String(otp)),
      },
    });

    if (!result.matchedCount) {
      throw new BadRequestException(
        "Fail to send the reset code please try again later",
      );
    }

    emailEvent.emit("resetPassword", { to: email, otp });
    return res.json({
      message: "Done",
    });
  };

  verifyForgotPassword = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const { email, otp }: IVerifyForgotPasswordBodyInputDTO = req.body;

    const user = await this.userModel.findOne({
      filter: {
        email,
        provider: ProviderEnum.SYSTEM,
        resetPasswordOtp: { $exists: true },
      },
    });

    if (!user) {
      throw new NotFoundException(
        "invalid account due to one of the following reasons [not register , invalid provider , not confirmed account , missing resetPasswordOtp]",
      );
    }

    if (!(await compareHash(otp, user.resetPasswordOtp as string))) {
      throw new ConflictException("Invalid otp");
    }

    return res.json({
      message: "Done",
    });
  };

  resetForgotPassword = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const { email, otp, password }: IResetForgotPasswordBodyInputDTO = req.body;

    const user = await this.userModel.findOne({
      filter: {
        email,
        provider: ProviderEnum.SYSTEM,
        resetPasswordOtp: { $exists: true },
      },
    });

    if (!user) {
      throw new NotFoundException(
        "invalid account due to one of the following reasons [not register , invalid provider , not confirmed account , missing resetPasswordOtp]",
      );
    }

    if (!(await compareHash(otp, user.resetPasswordOtp as string))) {
      throw new ConflictException("Invalid otp");
    }

    const result = await this.userModel.updateOne({
      filter: { email },
      update: {
        password: await generateHash(password),
        changeCredentialsTime: new Date(),
        $unset: { resetPasswordOtp: 1 },
      },
    });

    if (!result.matchedCount) {
      throw new BadRequestException("Fail to reset account password");
    }

    return res.json({
      message: "Done",
    });
  };
}

export default new AuthenticationService();
