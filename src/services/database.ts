import * as mongoose from "mongoose";
import { todosModel } from "../app/models/todo.model";
import { usersModel } from "../app/models/user.model";
import { IConfig, IDatabase } from "../interfaces";

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
    connect
  };
};
