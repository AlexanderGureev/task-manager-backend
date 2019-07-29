import * as Hapi from "@hapi/hapi";
import * as path from "path";
import { IConfig, IDatabase, IPlugin } from "./app/interfaces/common.interface";

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

const initServer = async (config: IConfig, db: IDatabase) => {
  try {
    await db.connect(config);
    const appServer = new Hapi.Server({
      port: config.PORT,
      host: config.HOST
    });
    await registerPlugins(config, appServer);

    await appServer.start();
    console.log("Server running at:", appServer.info.uri);

    return appServer;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { initServer };
