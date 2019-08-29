import * as Boom from "@hapi/boom";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { IAuthService } from "../interfaces/auth.interface";
import {
  IUser,
  IUserController,
  IUserService
} from "../interfaces/user.interface";

export class UserController implements IUserController {
  constructor(
    private readonly userService: IUserService,
    private readonly authService: IAuthService
  ) {}

  public async register(req: Request, h: ResponseToolkit) {
    try {
      const user = await this.userService.register(req.payload as IUser);
      const token = await this.authService.createSession(req, user);

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
      const token = await this.authService.createSession(req, user);
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
      await this.authService.deleteSession(req);
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
      const { userId }: any = req.params.userId
        ? req.params
        : req.auth.credentials;

      const user = await this.userService.getUserProfile(userId);
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
}
