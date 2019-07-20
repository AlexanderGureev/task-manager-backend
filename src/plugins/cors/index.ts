import * as Hapi from "hapi";
import { IConfig } from "../../app/interfaces";

export const cors = {
  name: "cors",
  version: "1.0.0",
  register: async (server: Hapi.Server, options?: IConfig) => {
    await server.register({
      plugin: require("hapi-cors"),
      options: {
        origins: ["*"],
        allowCredentials: "true",
        exposeHeaders: ["content-type", "content-length", "set-cookie"],
        maxAge: 600,
        methods: ["GET, POST, PUT, PATCH, DELETE, HEAD, OPTION"],
        headers: ["Accept", "Content-Type", "Authorization"]
      }
    });
  }
};
