import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";

import * as mongoose from "mongoose";

export enum Providers {
  local = "LOCAL",
  google = "GOOGLE",
  facebook = "FACEBOOK",
  vk = "VK"
}
export interface IUserModel extends mongoose.Document {
  _id: string;
  provider: Providers;
  username: string;
  password: string;
  email: string;
  hashPassword: any;
  comparePassword: any;
  categories: mongoose.Types.ObjectId[];
  avatarPath: string;
}

export interface IUser {
  _id: string;
  provider: Providers;
  username: string;
  password: string;
  email: string;
  categories: mongoose.Types.ObjectId[];
  avatarPath: string;
}
export interface IUserController {
  register: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
  login: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
  logout: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
  getUserProfile: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
  updateUserById: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
}

export interface IUserService {
  register: (user: IUser) => Promise<IUser>;
  login: (object: object) => Promise<IUser>;
  getUserProfile: (userId: string) => Promise<IUser>;
  updateUserById: (userId: string, body: IUser) => Promise<IUser>;
}
