import * as Boom from "@hapi/boom";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { IAuthService } from "../interfaces/auth.interface";
import {
  ISocialAuthController,
  ISocialAuthPayload,
  ISocialAuthService
} from "../interfaces/socialAuth.interface";
import { ITokenService } from "../interfaces/token.interface";

export class SocialAuthController implements ISocialAuthController {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly socialAuthService: ISocialAuthService,
    private readonly authService: IAuthService
  ) {}

  public async registerOrLogin(req: Request, h: ResponseToolkit) {
    try {
      const { code, provider } = req.payload as ISocialAuthPayload;

      const token = await this.tokenService.createAccessToken(code, provider);
      if (!token) {
        throw Boom.forbidden("Authorization data is not valid");
      }
      const user = await this.socialAuthService.registerOrLogin(
        token,
        provider
      );

      const sessionToken = await this.authService.createSession(req, user);

      return h
        .response(user)
        .code(201)
        .state("token", sessionToken);
    } catch (error) {
      let err: Boom;
      if (error.name && error.name === "MongoError") {
        err = Boom.forbidden("User with such data already exists.");
      }
      return err || error;
    }
  }
}
