import { Request, ResponseToolkit } from "hapi";
import * as JWT from "jsonwebtoken";
import { config } from "../../config";
import { IUser, IUserController, IUserService } from "../../interfaces";

export class UserController implements IUserController {
  constructor(public userService: IUserService) {}

  public async register(req: Request, h: ResponseToolkit) {
    try {
      const user = await this.userService.register(req.payload as IUser);
      const session = {
        username: user.username,
        id: user._id
      };
      const token = JWT.sign(session, config.JWT_KEY);

      return h
        .response(user)
        .code(201)
        .state("token", token);
    } catch (error) {
      console.log(error); // реализовать вывод ошибки при дубликатах почты
      return error;
    }
  }
  public async login(req: Request, h: ResponseToolkit) {
    try {
      const user = await this.userService.login(req.payload as object);
      console.log(user);
      return h.response(user).code(201);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
