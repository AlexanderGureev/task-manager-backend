import { RequestAuth, RouteOptions, Server } from "@hapi/hapi";

import * as mongoose from "mongoose";
import { ICategoryModel } from "./category.interface";
import { ITodoModel } from "./todo.interface";
import { ITokenModel } from "./token.interface";
import { IUserModel } from "./user.interface";

export interface IPlugin {
  name: string;
  version: string;
  register: (server: Server, options?: object) => Promise<IPlugin>;
}

export interface IRoute {
  method: string;
  path: string;
  options?: RouteOptions;
  handler?: object;
}

export interface IRouter {
  getRoutes: () => IRoute[];
}

export interface IDatabase {
  todosModel: mongoose.Model<ITodoModel>;
  usersModel: mongoose.Model<IUserModel>;
  tokenModel: mongoose.Model<ITokenModel>;
  categoriesModel: mongoose.Model<ICategoryModel>;
  connect: (config: IConfig) => void;
}

interface IOAuthData {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  REDIRECT_URI: string;
}

export interface IConfig {
  PORT: string;
  HOST: string;
  MONGO_URI?: string;
  REDIS_URI?: string;
  SESSION_PREFIX: string;
  API_VERSION: string;
  ENV: string;
  JWT_SECRET: string;
  COOKIE_SECRET: string;
  plugins: string[];
  PUBLIC_DIR: string;
  SOCIAL_AUTH: {
    GOOGLE: IOAuthData;
    VK: IOAuthData;
    FACEBOOK: IOAuthData;
  };
  CLIENT_URL: string;
}

export interface IMongoConnection {
  username: string;
  password: string;
  database: string;
}
