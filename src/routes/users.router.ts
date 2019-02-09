import * as Hapi from "hapi";
import * as Joi from "joi";
import { IRoute, IRouter, IUserController } from "../interfaces";

export class UsersRouter implements IRouter {
  private routes: IRoute[];

  constructor(
    private server: Hapi.Server,
    private userController: IUserController
  ) {
    this.setupRouter();
  }

  public getRoutes(): IRoute[] {
    return this.routes;
  }

  private getValidateRules(...fields) {
    const validateFields = {
      username: Joi.string()
        .min(3)
        .max(20),
      password: Joi.string()
        .min(3)
        .max(20),
      email: Joi.string().email()
    };

    return fields.reduce(
      (acc, { name, required = false }) => ({
        [name]: required
          ? validateFields[name].required()
          : validateFields[name],
        ...acc
      }),
      {}
    );
  }

  private setupRouter() {
    this.routes = [
      {
        method: "POST",
        path: "/register",
        options: {
          handler: this.userController.register.bind(this.userController),
          validate: {
            payload: this.getValidateRules(
              { name: "username", required: true },
              { name: "password", required: true },
              { name: "email", required: true }
            )
          },
          auth: false
        }
      },
      {
        method: "POST",
        path: "/login",
        options: {
          handler: this.userController.login.bind(this.userController),
          validate: {
            payload: this.getValidateRules(
              { name: "password", required: true },
              { name: "email", required: true }
            )
          },
          auth: false
        }
      }
    ];
  }
}
