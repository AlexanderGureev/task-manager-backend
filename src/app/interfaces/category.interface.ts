import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import * as mongoose from "mongoose";

export interface ICategoryModel extends mongoose.Document {
  _id: string;
  name: string;
  author: mongoose.Types.ObjectId;
  todos: mongoose.Types.ObjectId[];
  todosCountByCategory?: number;
}
export interface ICategory {
  _id: string;
  name: string;
  author: mongoose.Types.ObjectId;
  todos: mongoose.Types.ObjectId[];
  todosCountByCategory?: number;
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
