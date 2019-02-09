import * as Joi from "joi";
import { IRoute, IRouter, IUserController } from "../interfaces";

export class UserRouter implements IRouter {
  private routes: IRoute[];
  private apiVersion: string = "/v1";

  constructor(private userController: IUserController) {
    this.setupRouter();
  }

  public getRoutes(): IRoute[] {
    return this.routes;
  }

  private getValidateRules(...fields) {
    const validateFields = {
      username: Joi.string()
        .min(3)
        .max(20)
        .alphanum()
        .default("alex"),
      password: Joi.string()
        .min(3)
        .max(20)
        .default("test_password"),
      email: Joi.string()
        .email()
        .default("alex@gmail.com")
    };

    return fields.reduce(
      (acc, { name, required = false, description = "" }) => ({
        [name]: required
          ? validateFields[name].required().description(description || name)
          : validateFields[name].description(description || name),
        ...acc
      }),
      {}
    );
  }

  private setupRouter() {
    this.routes = [
      {
        method: "POST",
        path: this.apiVersion + "/register",
        options: {
          handler: this.userController.register.bind(this.userController),
          validate: {
            payload: this.getValidateRules(
              { name: "username", required: true },
              { name: "password", required: true },
              { name: "email", required: true }
            )
          },
          description: "Register a new user",
          notes: "Returns a new user and cookie with token",
          tags: ["api", "auth"],
          plugins: {
            "hapi-swagger": {
              order: 1
            }
          },
          auth: false
        }
      },
      {
        method: "POST",
        path: this.apiVersion + "/login",
        options: {
          handler: this.userController.login.bind(this.userController),
          validate: {
            payload: this.getValidateRules(
              { name: "password", required: true },
              { name: "email", required: true }
            )
          },
          description: "User Authorization",
          notes: "Returns a new user and cookie with token",
          tags: ["api", "auth"],
          plugins: {
            "hapi-swagger": {
              order: 2
            }
          },
          auth: false
        }
      },
      {
        method: "GET",
        path: this.apiVersion + "/logout",
        options: {
          handler: this.userController.logout.bind(this.userController),
          description: "User logout",
          notes: "Returns nothing",
          tags: ["api", "auth"],
          plugins: {
            "hapi-swagger": {
              order: 3
            }
          }
        }
      }
    ];
  }
}
