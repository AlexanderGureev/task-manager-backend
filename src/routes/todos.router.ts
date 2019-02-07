import * as Hapi from "hapi";
import * as Joi from "joi";
import { IDatabase, IRoute, ITodoController, ITodoRouter } from "../interfaces";

export class TodosRouter implements ITodoRouter {
  private routes: IRoute[];
  constructor(
    private server: Hapi.Server,
    private db: IDatabase,
    private todoController: ITodoController
  ) {
    this.setupRouter();
  }

  public getRoutes(): IRoute[] {
    return this.routes;
  }

  private setupRouter() {
    this.server.bind(this.todoController);

    this.routes = [
      {
        method: "GET",
        path: "/todos",
        options: {
          handler: this.todoController.getTodos
        }
      },
      {
        method: "POST",
        path: "/todos",
        options: {
          handler: this.todoController.addTodo,
          validate: {
            payload: {
              text: Joi.string()
                .min(1)
                .required()
            }
          }
        }
      }
    ];
  }
}
