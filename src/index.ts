import * as Hapi from "hapi";
import { TodoController } from "./app/controllers/todos.controller";
import { config } from "./config";
import { IConfig, IPlugin } from "./interfaces";
import { TodosRouter } from "./routes/todos.router";
import { initServer } from "./server";
import { database } from "./services/database";
import { TodoService } from "./services/todos";

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
const registerPlugins = async (config: IConfig, server: Hapi.Server) => {
  const plugins: Array<Promise<IPlugin>> = config.plugins.map(pluginName => {
    const plugin: IPlugin = require("./plugins/logger")[pluginName];
    console.log(`Plugin: ${plugin.name} registered.`);
    return plugin.register(server);
  });
  await Promise.all(plugins);
};

const initApp = async () => {
  try {
    const db = database();
    const server = await initServer(config, db);

    const todoService = new TodoService(db);
    const todoController = new TodoController(todoService);
    const todoRouter = new TodosRouter(server, db, todoController);

    server.route(todoRouter.getRoutes());
    await registerPlugins(config, server);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

initApp();
exceptionHandle();
