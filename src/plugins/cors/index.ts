import * as Hapi from "hapi";
import { IConfig } from "../../interfaces";

export const cors = {
  name: "cors",
  version: "1.0.0",
  register: async (server: Hapi.Server, options?: IConfig) => {
    await server.register({
      plugin: require("hapi-cors"),
      options: {
        origins: ["*"],
        allowCredentials: "true",
        exposeHeaders: ["content-type", "content-length"],
        maxAge: 600,
        methods: ["POST, GET, OPTIONS"],
        headers: ["Accept", "Content-Type", "Authorization", "Set-Cookie"]
      }
    });
  }
};
