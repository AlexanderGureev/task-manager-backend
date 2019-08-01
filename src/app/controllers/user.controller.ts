import * as Boom from "@hapi/boom";
import { Request, ResponseToolkit } from "@hapi/hapi";
import * as JWT from "jsonwebtoken";
import { v4 } from "uuid";
import { config } from "../../config";
import {
  IUser,
  IUserController,
  IUserService
} from "../interfaces/user.interface";

export class UserController implements IUserController {
  constructor(public userService: IUserService) {}

  public async register(req: Request, h: ResponseToolkit) {
    try {
      const user = await this.userService.register(req.payload as IUser);
      const token = await this.createSession(req, user);

      return h
        .response(user)
        .code(201)
        .state("token", token);
    } catch (error) {
      let err: Boom;
      if (error.name && error.name === "MongoError") {
        err = Boom.forbidden("User with such data already exists.");
      }
      return err || error;
    }
  }
  public async login(req: Request, h: ResponseToolkit) {
    try {
      const user = await this.userService.login(req.payload as object);
      const token = await this.createSession(req, user);
      return h
        .response(user)
        .code(201)
        .state("token", token);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  public async logout(req: Request, h: ResponseToolkit) {
    try {
      await this.deleteSession(req);
      return h
        .response()
        .unstate("token")
        .code(204);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  public async getUserProfile(req: Request, h: ResponseToolkit) {
    try {
      const user = await this.userService.getUserProfile(req.params);
      if (!user) {
        return h.response().code(204);
      }
      return h.response(user).code(201);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  public async updateUserById(req: Request, h: ResponseToolkit) {
    try {
      const user = await this.userService.updateUserById(
        req.params.userId,
        req.payload as IUser
      );
      if (!user) {
        return h.response().code(204);
      }
      return h.response(user).code(200);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  private async deleteSession(req) {
    await req.redis.delAsync(req.auth.credentials.id);
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
