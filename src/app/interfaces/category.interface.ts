import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import * as mongoose from "mongoose";
import { ITodo } from "./todo.interface";
import { IUser } from "./user.interface";

export interface ICategoryModel extends mongoose.Document {
  _id: string;
  name: string;
  author: mongoose.Types.ObjectId | IUser;
  color: string;
  todos: mongoose.Types.ObjectId[];
  todosCountByCategory?: number;
}
export interface ICategory {
  _id: string;
  name: string;
  author: mongoose.Types.ObjectId | IUser;
  color: string;
  todos: mongoose.Types.ObjectId[];
  todosCountByCategory?: number;
}

export enum CategoryEvents {
  DELETE_CATEGORY_EVENT = "DELETE_CATEGORY_EVENT",
  CREATE_CATEGORY_EVENT = "CREATE_CATEGORY_EVENT"
}

export interface IDeleteCategoryEventPayload {
  userId: string;
  categoryId: string;
  todos: ITodo[];
}
export interface ICreateCategoryEventPayload {
  userId: string;
  category: ICategory;
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
