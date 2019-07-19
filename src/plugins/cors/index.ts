import * as Hapi from "hapi";
import { IConfig } from "../../interfaces";

export const cors = {
  name: "cors",
  version: "1.0.0",
  register: async (server: Hapi.Server, options?: IConfig) => {
    await server.register(require("hapi-cors"));
  }
};
