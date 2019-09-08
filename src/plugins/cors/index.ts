import * as Hapi from "@hapi/hapi";
import { IConfig } from "../../app/interfaces/common.interface";

export const cors = {
  name: "cors",
  version: "1.0.0",
  register: async (server: Hapi.Server, config: IConfig) => {
    await server.register({
      plugin: require("hapi-cors"),
      options: {
        origins: [config.CLIENT_URL, "https://api-hapi-todo.herokuapp.com"],
        allowCredentials: "true",
        methods: ["POST, GET, PATCH, PUT, OPTIONS, DELETE"]
      }
    });
  }
};
