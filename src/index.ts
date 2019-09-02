import * as dotenv from "dotenv";
import { Types } from "mongoose";
dotenv.config();

import { CategoryController } from "./app/controllers/category.controller";
import { FileController } from "./app/controllers/file.controller";
import { TodoController } from "./app/controllers/todo.controller";
import { UserController } from "./app/controllers/user.controller";
import { CategoryRouter } from "./app/routes/category.router";
import { FileRouter } from "./app/routes/file.router";
import { TodoRouter } from "./app/routes/todo.router";
import { UserRouter } from "./app/routes/user.router";
import { CategoryService } from "./app/services/category.service";
import { FileService } from "./app/services/file.service";
import { TodoService } from "./app/services/todo.service";
import { UserService } from "./app/services/user.service";

import { SocialAuthController } from "./app/controllers/socialAuth.controller";
import { SocialAuthRouter } from "./app/routes/socialAuth.router";
import { SocialAuthService } from "./app/services/socialAuthService";
import { TokenService } from "./app/services/token.service";

import { AuthService } from "./app/services/authService";
import { database } from "./app/services/database";
import { config } from "./config";
import { initServer } from "./server";

import { EventBus } from "./app/services/eventBus.service";

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

const createTestTasks = async db => {
  try {
    const user = await db.usersModel
      .findOne({ email: "g.alex00@bk.ru" })
      .exec();
    const category = await db.categoriesModel
      .findOne({ author: user._id })
      .exec();
    category.todos = [];

    for (let i = 0; i < 10000; i++) {
      const todo = new db.todosModel({
        text: `todo-${i}`,
        categoryId: category._id
      });
      category.todos.push(Types.ObjectId(todo._id));
      await todo.save();
    }
    const {
      todos: { length }
    } = await category.save();
    console.log(length);
  } catch (error) {
    console.log(error);
  }
};
const initApp = async () => {
  try {
    const db = database();

    const server = await initServer(config, db);
    // await createTestTasks(db);

    const authService = new AuthService(config);
    const tokenService = new TokenService(config);
    const eventBus = new EventBus();

    const userService = new UserService(db, eventBus);
    const userController = new UserController(userService, authService);
    const userRouter = new UserRouter(userController);

    const todoService = new TodoService(db, eventBus);
    const todoController = new TodoController(todoService);
    const todoRouter = new TodoRouter(todoController);

    const categoryService = new CategoryService(db, eventBus);
    const categoryController = new CategoryController(categoryService);
    const categoryRouter = new CategoryRouter(categoryController);

    const fileService = new FileService(config);
    const fileController = new FileController(fileService);
    const fileRouter = new FileRouter(fileController);

    const socialAuthService = new SocialAuthService(db);
    const socialAuthController = new SocialAuthController(
      tokenService,
      socialAuthService,
      authService
    );
    const socialAuthRouter = new SocialAuthRouter(socialAuthController);

    server.route(todoRouter.getRoutes());
    server.route(userRouter.getRoutes());
    server.route(categoryRouter.getRoutes());
    server.route(fileRouter.getRoutes());
    server.route(socialAuthRouter.getRoutes());
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

initApp();
exceptionHandle();
