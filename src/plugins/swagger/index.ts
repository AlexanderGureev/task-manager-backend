import * as Hapi from "@hapi/hapi";
import * as Inert from "@hapi/inert";
import * as Vision from "@hapi/vision";
import * as HapiSwagger from "hapi-swagger";
import { IConfig } from "../../app/interfaces/common.interface";

export const swagger = {
  name: "swagger",
  version: "1.0.0",
  register: async (server: Hapi.Server, options?: IConfig) => {
    const swaggerOptions = {
      documentationPath: "/",
      grouping: "tags",
      sortEndpoints: "ordered",
      tags: [
        {
          name: "users",
          description: "editing user information"
        },
        {
          name: "auth",
          description: "authentication and authorization"
        },
        {
          name: "todos",
          description: "actions on todos"
        },
        {
          name: "files",
          description: "upload and delete files"
        },
        {
          name: "categories",
          description: "user category management"
        }
      ],
      info: {
        title: "API Documentation",
        version: options.API_VERSION
      }
    };

    await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: swaggerOptions
      }
    ]);
  }
};
