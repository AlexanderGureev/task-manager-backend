import * as Hapi from "hapi";
import * as path from "path";
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
    const plugin: IPlugin = require(path.join(
      __dirname,
      "plugins",
      pluginName
    ))[pluginName];
    console.log(`Plugin: ${plugin.name} registered.`);
    return plugin.register(server, config);
  });
  await Promise.all(plugins);
};

const initApp = async () => {
  try {
    const db = database();
    const server = await initServer(config, db);

    const todoService = new TodoService(db);
    const todoController = new TodoController(todoService);
    const todoRouter = new TodosRouter(server, todoController);

    server.route(todoRouter.getRoutes());
    await registerPlugins(config, server);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

initApp();
exceptionHandle();
