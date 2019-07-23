import {
  Request,
  RequestQuery,
  ResponseObject,
  ResponseToolkit,
  RouteOptions,
  Server
} from "@hapi/hapi";

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
  categoriesModel: mongoose.Model<ICategoryModel>;
  connect: (config: IConfig) => void;
}
export interface ITodoModel extends mongoose.Document {
  _id: string;
  categoryId: mongoose.Types.ObjectId;
  text: string;
  status: string;
  primary: boolean;
  date: Date;
}
export interface ICategoryModel extends mongoose.Document {
  _id: string;
  name: string;
  author: mongoose.Types.ObjectId;
  todos: mongoose.Types.ObjectId[];
  todosCountByCategory?: number;
}

export interface IUserModel extends mongoose.Document {
  _id: string;
  username: string;
  password: string;
  email: string;
  hashPassword: any;
  comparePassword: any;
  categories: mongoose.Types.ObjectId[];
}
export interface ITodo {
  _id: string;
  categoryId: mongoose.Types.ObjectId;
  text: string;
  status: string;
  primary: boolean;
  date: Date;
}

export interface ICategory {
  _id: string;
  name: string;
  author: mongoose.Types.ObjectId;
  todos: mongoose.Types.ObjectId[];
  todosCountByCategory?: number;
}

export interface IResponseTodos {
  _id: string;
  name: string;
  author: mongoose.Types.ObjectId;
  todos: ITodo[];
}

export interface IUser {
  _id: string;
  username: string;
  password: string;
  email: string;
  categories: mongoose.Types.ObjectId[];
}
export interface IUserController {
  register: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
  login: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
  logout: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
  getUserProfile: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
}

export interface ITodoController {
  addTodo: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
  getTodosByCategory: (
    req: Request,
    h: ResponseToolkit
  ) => Promise<ResponseObject>;
  getTodos: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
  getTodoById: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
  updateTodoById: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
  deleteTodoById: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
}
export interface ICategoryController {
  createCategory: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
  getCategories: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
  getCategoryById: (
    req: Request,
    h: ResponseToolkit
  ) => Promise<ResponseObject>;
  updateCategoryById: (
    req: Request,
    h: ResponseToolkit
  ) => Promise<ResponseObject>;
  deleteCategoryById: (
    req: Request,
    h: ResponseToolkit
  ) => Promise<ResponseObject>;
}
export interface ITodoService {
  addTodo: (todo: ITodo) => Promise<ITodo>;
  getTodosByCategory: (
    categoryId: string,
    query: RequestQuery
  ) => Promise<ICategory>;
  getTodos: (query: RequestQuery, credentials: object) => Promise<ICategory[]>;
  getTodoById: (id: string) => Promise<ITodo>;
  updateTodoById: (id: string, todo: ITodo) => Promise<ITodo>;
  deleteTodoById: (id: string) => Promise<ITodo>;
}
export interface IUserService {
  register: (user: IUser) => Promise<IUser>;
  login: (object: object) => Promise<IUser>;
  getUserProfile: (credentials: object) => Promise<IUser>;
}
export interface ICategoryService {
  createCategory: (
    credentials: object,
    category: ICategory
  ) => Promise<ICategory>;
  getCategories: (credentials: object) => Promise<ICategory[]>;
  getCategoryById: (id: string) => Promise<ICategory>;
  updateCategoryById: (
    id: string,
    categoryData: ICategory
  ) => Promise<ICategory>;
  deleteCategoryById: (id: string) => Promise<ICategory>;
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
