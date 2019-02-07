import * as Hapi from "hapi";
import * as pino from "hapi-pino";

export const logger = {
  name: "logger",
  version: "1.0.0",
  register: async (server: Hapi.Server, options?: object) =>
    server.register({
      plugin: pino,
      options: {
        prettyPrint: true,
        logEvents: ["response", "onPostStart"]
      }
    })
};
