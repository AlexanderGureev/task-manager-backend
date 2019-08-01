import * as mongoose from "mongoose";
import { IConfig, IDatabase } from "../interfaces/common.interface";
import { categoriesModel } from "../models/category.model";
import { todosModel } from "../models/todo.model";
import { usersModel } from "../models/user.model";

const connect = async (config: IConfig) => {
  try {
    await mongoose.connect(config.MONGO_URI, { useNewUrlParser: true });
    console.log("Connected to database.");
  } catch (error) {
    console.log("Unable to connect to database.");
    throw new Error(error.message);
  }
};

export const database = (): IDatabase => {
  return {
    todosModel,
    usersModel,
    categoriesModel,
    connect
  };
};
