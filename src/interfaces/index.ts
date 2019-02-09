import {
  Request,
  ResponseObject,
  ResponseToolkit,
  RouteOptions,
  Server
} from "hapi";

import * as mongoose from "mongoose";
export interface IPlugin {
  name: string;
  version: string;
  register: (server: Server, options?: object) => Promise<IPlugin>;
}
export interface IRouter {
  getRoutes: () => IRoute[];
}

export interface IDatabase {
  todosModel: mongoose.Model<ITodoModel>;
  usersModel: mongoose.Model<IUserModel>;
  connect: (config: IConfig) => void;
}
export interface ITodoModel extends mongoose.Document {
  _id: string;
  text: string;
  status: string;
  primary: boolean;
}
export interface IUserModel extends mongoose.Document {
  _id: string;
  username: string;
  password: string;
  email: string;
  hashPassword: any;
  comparePassword: any;
}
export interface ITodo {
  _id: string;
  text: string;
  status: string;
  primary: boolean;
}
export interface IUser {
  _id: string;
  username: string;
  password: string;
  email: string;
}
export interface IUserController {
  register: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
  login: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
}
export interface IUserService {
  register: (user: IUser) => Promise<IUser>;
  login: (object: object) => Promise<IUser>;
}

export interface ITodoController {
  addTodo: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
  getTodos: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
  getTodoById: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
  updateTodoById: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
  deleteTodoById: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
}
export interface ITodoService {
  addTodo: (todo: ITodo) => Promise<ITodo>;
  getTodos: (limit: number) => Promise<ITodo[]>;
  getTodoById: (id: string) => Promise<ITodo>;
  updateTodoById: (id: string, todo: ITodo) => Promise<ITodo>;
  deleteTodoById: (id: string) => Promise<ITodo>;
}
export interface IConfig {
  PORT: string;
  HOST: string;
  MONGO_URI?: string;
  ENV: string;
  JWT_KEY: string;
  plugins: string[];
}
export interface IRoute {
  method: string;
  path: string;
  options: RouteOptions;
}

export interface IMongoConnection {
  username: string;
  password: string;
  database: string;
}
