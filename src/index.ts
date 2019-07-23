import * as dotenv from "dotenv";
dotenv.config();

import { CategoryController } from "./app/controllers/category.controller";
import { TodoController } from "./app/controllers/todo.controller";
import { UserController } from "./app/controllers/user.controller";
import { CategoryRouter } from "./app/routes/category.router";
import { TodoRouter } from "./app/routes/todo.router";
import { UserRouter } from "./app/routes/user.router";
import { CategoryService } from "./app/services/category.service";
import { database } from "./app/services/database";
import { TodoService } from "./app/services/todo.service";
import { UserService } from "./app/services/user.service";
import { config } from "./config";
import { initServer } from "./server";

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

    const categoryService = new CategoryService(db);
    const categoryController = new CategoryController(categoryService);
    const categoryRouter = new CategoryRouter(categoryController);

    server.route(todoRouter.getRoutes());
    server.route(userRouter.getRoutes());
    server.route(categoryRouter.getRoutes());
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

initApp();
exceptionHandle();
