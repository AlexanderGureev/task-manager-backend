import * as dotenv from "dotenv";
dotenv.config();

import { TodoController } from "./app/controllers/todo.controller";
import { UserController } from "./app/controllers/user.controller";
import { config } from "./config";
import { TodoRouter } from "./routes/todo.router";
import { UserRouter } from "./routes/user.router";
import { initServer } from "./server";
import { database } from "./services/database";
import { TodoService } from "./services/todo.service";
import { UserService } from "./services/user.service";

const exceptionHandle = () => {
  process.on("uncaughtException", (error: Error) => {
    console.error(`uncaughtException ${error.message}`);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason: any) => {
    console.error(`unhandledRejection ${reason}`);
    process.exit(1);
  });
};

const initApp = async () => {
  try {
    const db = database();
    const server = await initServer(config, db);

    const todoService = new TodoService(db);
    const todoController = new TodoController(todoService);
    const todoRouter = new TodoRouter(todoController);

    const userService = new UserService(db);
    const userController = new UserController(userService);
    const userRouter = new UserRouter(userController);

    server.route(todoRouter.getRoutes());
    server.route(userRouter.getRoutes());
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

initApp();
exceptionHandle();
