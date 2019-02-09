import * as Hapi from "hapi";
import * as Joi from "joi";
import { IRoute, IRouter, ITodoController } from "../interfaces";

export class TodosRouter implements IRouter {
  private routes: IRoute[];

  constructor(
    private server: Hapi.Server,
    private todoController: ITodoController
  ) {
    this.setupRouter();
  }

  public getRoutes(): IRoute[] {
    return this.routes;
  }

  private getValidateRules(...fields) {
    const validateFields = {
      id: Joi.string()
        .min(24)
        .max(24),
      limit: Joi.number()
        .min(1)
        .max(100)
        .default(10),
      text: Joi.string().min(1),
      primary: Joi.boolean(),
      status: Joi.string()
        .example("active")
        .example("completed")
    };

    return fields.reduce(
      (acc, { name, required = false }) => ({
        [name]: required
          ? validateFields[name].required()
          : validateFields[name],
        ...acc
      }),
      {}
    );
  }

  private setupRouter() {
    this.routes = [
      {
        method: "GET",
        path: "/todos",
        options: {
          handler: this.todoController.getTodos.bind(this.todoController),
          validate: {
            query: this.getValidateRules({ name: "limit" })
          },
          auth: "jwt"
        }
      },
      {
        method: "POST",
        path: "/todos",
        options: {
          handler: this.todoController.addTodo.bind(this.todoController),
          validate: {
            payload: this.getValidateRules(
              { name: "text", required: true },
              { name: "status" },
              { name: "primary" }
            )
          }
        }
      },
      {
        method: "GET",
        path: "/todos/{id}",
        options: {
          handler: this.todoController.getTodoById.bind(this.todoController),
          validate: {
            params: this.getValidateRules({ name: "id", required: true })
          }
        }
      },
      {
        method: "PUT",
        path: "/todos/{id}",
        options: {
          handler: this.todoController.updateTodoById.bind(this.todoController),
          validate: {
            params: this.getValidateRules({ name: "id", required: true }),
            payload: this.getValidateRules(
              { name: "text" },
              { name: "status" },
              { name: "primary" }
            )
          }
        }
      },
      {
        method: "DELETE",
        path: "/todos/{id}",
        options: {
          handler: this.todoController.deleteTodoById.bind(this.todoController),
          validate: {
            params: this.getValidateRules({ name: "id", required: true })
          }
        }
      }
    ];
  }
}
