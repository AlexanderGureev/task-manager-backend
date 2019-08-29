import * as Boom from "@hapi/boom";
import { Request, ResponseToolkit } from "@hapi/hapi";
import * as JWT from "jsonwebtoken";
import { v4 } from "uuid";
import { config } from "../../config";
import {
  ISocialAuthController,
  ISocialAuthPayload,
  ISocialAuthService
} from "../interfaces/socialAuth.interface";
import { ITokenService } from "../interfaces/token.interface";

export class SocialAuthController implements ISocialAuthController {
  constructor(
    public tokenService: ITokenService,
    public socialAuthService: ISocialAuthService
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

      const sessionToken = await this.createSession(req, user);

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

  private async createSession(req, { username, _id }) {
    const session = {
      username,
      id: v4(),
      userId: _id
    };
    const token = JWT.sign(session, config.JWT_SECRET);
    await req.redis.setAsync(
      `${config.SESSION_PREFIX}:${session.id}`,
      JSON.stringify(token)
    );
    return token;
  }
}
