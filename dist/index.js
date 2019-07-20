"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const todo_controller_1 = require("./app/controllers/todo.controller");
const user_controller_1 = require("./app/controllers/user.controller");
const todo_router_1 = require("./app/routes/todo.router");
const user_router_1 = require("./app/routes/user.router");
const database_1 = require("./app/services/database");
const todo_service_1 = require("./app/services/todo.service");
const user_service_1 = require("./app/services/user.service");
const config_1 = require("./config");
const server_1 = require("./server");
const exceptionHandle = () => {
    process.on("uncaughtException", (error) => {
        console.error(`uncaughtException ${error.message}`);
        process.exit(1);
    });
    process.on("unhandledRejection", (reason) => {
        console.error(`unhandledRejection ${reason}`);
        process.exit(1);
    });
};
const initApp = () => __awaiter(this, void 0, void 0, function* () {
    try {
        const db = database_1.database();
        const server = yield server_1.initServer(config_1.config, db);
        const todoService = new todo_service_1.TodoService(db);
        const todoController = new todo_controller_1.TodoController(todoService);
        const todoRouter = new todo_router_1.TodoRouter(todoController);
        const userService = new user_service_1.UserService(db);
        const userController = new user_controller_1.UserController(userService);
        const userRouter = new user_router_1.UserRouter(userController);
        server.route(todoRouter.getRoutes());
        server.route(userRouter.getRoutes());
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
});
initApp();
exceptionHandle();
//# sourceMappingURL=index.js.map