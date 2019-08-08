import * as Joi from "@hapi/joi";
import { IRoute, IRouter } from "../interfaces/common.interface";
import { IUserController } from "../interfaces/user.interface";
import {
  updatedUserProfileSchema,
  userCreatedSchema,
  userSchema
} from "../schemas";

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
      userId: Joi.string()
        .min(24)
        .max(24),
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
        .default("alex@gmail.com"),
      avatarPath: Joi.string().default("/upload/ava_default.png")
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
              payloadType: "form",
              responses: {
                201: {
                  description: "Registration successful, user created.",
                  schema: userCreatedSchema
                },
                403: {
                  description: "Authorization Error."
                }
              },
              order: 2
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
              payloadType: "form",
              responses: {
                201: {
                  description: "Login successful.",
                  schema: userSchema
                },
                403: {
                  description: "Authorization Error."
                }
              },
              order: 1
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
              responses: {
                204: {
                  description: "Logout successful."
                },
                403: {
                  description: "Authorization Error."
                }
              },
              order: 3
            }
          }
        }
      },
      {
        method: "GET",
        path: this.apiVersion + "/users/{userId?}",
        options: {
          handler: this.userController.getUserProfile.bind(this.userController),
          description: "User profile",
          notes: "Returns user model",
          tags: ["api", "users"],
          validate: {
            params: this.getValidateRules({
              name: "userId",
              description: "User id"
            })
          },
          plugins: {
            "hapi-swagger": {
              responses: {
                201: {
                  description: "User profile.",
                  schema: userSchema
                },
                400: {
                  description: "Validation failed."
                },
                403: {
                  description: "Authorization Error."
                },
                404: {
                  description: "User not found."
                }
              },
              order: 1
            }
          }
        }
      },
      {
        method: "PATCH",
        path: this.apiVersion + "/users/{userId}",
        options: {
          handler: this.userController.updateUserById.bind(this.userController),
          validate: {
            params: this.getValidateRules({
              name: "userId",
              required: true,
              description: "User id"
            }),
            payload: this.getValidateRules({
              name: "avatarPath",
              description: "Avatar path"
            })
          },
          description: "Updates the user profile",
          notes: "Returns updated user profile",
          tags: ["api", "users"],
          plugins: {
            "hapi-swagger": {
              payloadType: "form",
              responses: {
                200: {
                  description: "Updated user profile.",
                  schema: updatedUserProfileSchema
                },
                204: {
                  description: "No content"
                },
                400: {
                  description: "Validation failed."
                },
                403: {
                  description: "Authorization required."
                }
              },
              order: 2
            }
          }
        }
      }
    ];
  }
}
