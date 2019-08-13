import {
  Request,
  RequestQuery,
  ResponseObject,
  ResponseToolkit
} from "@hapi/hapi";

import * as mongoose from "mongoose";
import { ICategory } from "./category.interface";

export interface ITodoModel extends mongoose.Document {
  _id: string;
  categoryId: mongoose.Types.ObjectId;
  text: string;
  status: string;
  primary: boolean;
  date: Date;
}

export interface ITodo {
  _id: string;
  categoryId: mongoose.Types.ObjectId;
  text: string;
  status: string;
  primary: boolean;
  date: Date;
}

export interface IResponseTodos {
  _id: string;
  name: string;
  author: mongoose.Types.ObjectId;
  todos: ITodo[];
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
  updatePositionTodosByCategory: (
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
  updatePositionTodosByCategory: (
    categoryId: string,
    todos: string[]
  ) => Promise<mongoose.Types.ObjectId[]>;
}
