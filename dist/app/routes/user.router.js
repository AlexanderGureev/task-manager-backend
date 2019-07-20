"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const schemas_1 = require("../schemas");
class UserRouter {
    constructor(userController) {
        this.userController = userController;
        this.apiVersion = "/v1";
        this.setupRouter();
    }
    getRoutes() {
        return this.routes;
    }
    getValidateRules(...fields) {
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
        return fields.reduce((acc, { name, required = false, description = "" }) => (Object.assign({ [name]: required
                ? validateFields[name].required().description(description || name)
                : validateFields[name].description(description || name) }, acc)), {});
    }
    setupRouter() {
        this.routes = [
            {
                method: "POST",
                path: this.apiVersion + "/register",
                options: {
                    handler: this.userController.register.bind(this.userController),
                    validate: {
                        payload: this.getValidateRules({ name: "username", required: true }, { name: "password", required: true }, { name: "email", required: true })
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
                                    schema: schemas_1.userCreatedSchema
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
                method: "POST",
                path: this.apiVersion + "/login",
                options: {
                    handler: this.userController.login.bind(this.userController),
                    validate: {
                        payload: this.getValidateRules({ name: "password", required: true }, { name: "email", required: true })
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
                                    schema: schemas_1.userCreatedSchema
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
            }
        ];
    }
}
exports.UserRouter = UserRouter;
//# sourceMappingURL=user.router.js.map