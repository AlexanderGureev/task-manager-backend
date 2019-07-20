import * as Hapi from "hapi";
import * as pino from "hapi-pino";
import { IConfig } from "../../app/interfaces";

export const logger = {
  name: "logger",
  version: "1.0.0",
  register: async (server: Hapi.Server, options: IConfig) => {
    server.register({
      plugin: pino,
      options: {
        prettyPrint: options.ENV === "development" ? true : false,
        logEvents: ["response", "onPostStart"],
        level: "debug"
      }
    });
  }
};
