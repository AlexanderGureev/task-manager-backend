import * as Joi from "@hapi/joi";
import { IRoute, IRouter } from "../interfaces/common.interface";
import { ISocialAuthController } from "../interfaces/socialAuth.interface";
import { userSchema } from "../schemas";

export class SocialAuthRouter implements IRouter {
  private routes: IRoute[];
  private apiVersion: string = "/v1";

  constructor(private socialAuthController: ISocialAuthController) {
    this.setupRouter();
  }

  public getRoutes(): IRoute[] {
    return this.routes;
  }

  private getValidateRules(...fields) {
    const validateFields = {
      code: Joi.string(),
      provider: Joi.string().valid(["google", "facebook", "vk"])
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
        path: this.apiVersion + "/oauth/login",
        options: {
          handler: this.socialAuthController.registerOrLogin.bind(
            this.socialAuthController
          ),
          validate: {
            payload: this.getValidateRules(
              {
                name: "code",
                required: true,
                description: "Authentication code"
              },
              {
                name: "provider",
                required: true,
                description: "Authentication service"
              }
            )
          },
          description:
            "Authentication and registration through third-party services",
          notes: "Returns a user and cookie with token",
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
              }
            }
          },
          auth: false
        }
      }
    ];
  }
}
