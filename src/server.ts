import * as Hapi from "hapi";
import { IConfig, IDatabase } from "./interfaces";

const initServer = async (config: IConfig, db: IDatabase) => {
  try {
    await db.connect(config);
    const appServer = new Hapi.Server({
      port: config.PORT,
      host: config.HOST
    });
    await appServer.start();
    console.log("Server running at:", appServer.info.uri);

    return appServer;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { initServer };
