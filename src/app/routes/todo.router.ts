import * as Joi from "joi";
import { IRoute, IRouter, ITodoController } from "../interfaces";
import { listTodosSchema, todoSchema } from "../schemas";

export class TodoRouter implements IRouter {
  private routes: IRoute[];
  private apiVersion: string = "/v1";

  constructor(private todoController: ITodoController) {
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
      text: Joi.string()
        .min(1)
        .default("text todo"),
      primary: Joi.boolean().default(false),
      status: Joi.string()
        .valid("active")
        .valid("completed")
        .default("active")
    };

    return fields.reduce(
      (acc, { name, required = false, description = "" }) => ({
        [name]: required
          ? validateFields[name].required().description(description || name)
          : validateFields[name].description(description || name),
        ...acc
      }),
      {}
    );
  }

  private setupRouter() {
    this.routes = [
      {
        method: "GET",
        path: this.apiVersion + "/todos",
        options: {
          handler: this.todoController.getTodos.bind(this.todoController),
          validate: {
            query: this.getValidateRules({
              name: "limit",
              description: "Number of tasks"
            })
          },
          auth: "jwt",
          description: "Get all todos",
          notes: "Returns all todos item",
          tags: ["api", "todos"],
          plugins: {
            "hapi-swagger": {
              responses: {
                200: {
                  description: "List of all todos.",
                  schema: listTodosSchema
                },
                204: {
                  description: "Todo list is empty."
                },
                400: {
                  description: "Validation failed."
                },
                403: {
                  description: "Authorization required."
                }
              },
              order: 1
            }
          }
        }
      },
      {
        method: "POST",
        path: this.apiVersion + "/todos",
        options: {
          handler: this.todoController.addTodo.bind(this.todoController),
          validate: {
            payload: this.getValidateRules(
              { name: "text", required: true, description: "Task decription" },
              { name: "status", description: "Task status" },
              { name: "primary", description: "Task priority" }
            )
          },
          description: "Create a new todo",
          notes: "Returns the created todo",
          tags: ["api", "todos"],
          plugins: {
            "hapi-swagger": {
              payloadType: "form",
              responses: {
                201: {
                  description: "The todo has been successfully created."
                },
                400: {
                  description: "Validation failed."
                },
                403: {
                  description: "Authorization required."
                }
              },
              order: 3
            }
          }
        }
      },
      {
        method: "GET",
        path: this.apiVersion + "/todos/{id}",
        options: {
          handler: this.todoController.getTodoById.bind(this.todoController),
          validate: {
            params: this.getValidateRules({
              name: "id",
              required: true,
              description: "Task id"
            })
          },
          description: "Get a todo by id",
          notes: "Returns todo by id",
          tags: ["api", "todos"],
          plugins: {
            "hapi-swagger": {
              responses: {
                200: {
                  description: "Todo by id.",
                  schema: todoSchema
                },
                400: {
                  description: "Validation failed."
                },
                403: {
                  description: "Authorization required."
                },
                404: {
                  description: "Todo for this ID do not exist."
                }
              },
              order: 2
            }
          }
        }
      },
      {
        method: "PUT",
        path: this.apiVersion + "/todos/{id}",
        options: {
          handler: this.todoController.updateTodoById.bind(this.todoController),
          validate: {
            params: this.getValidateRules({
              name: "id",
              required: true,
              description: "Task id"
            }),
            payload: this.getValidateRules(
              { name: "text", description: "Task decription" },
              { name: "status", description: "Task status" },
              { name: "primary", description: "Task priority" }
            )
          },
          description: "Updates the todo by id",
          notes: "Returns updated todo by id",
          tags: ["api", "todos"],
          plugins: {
            "hapi-swagger": {
              payloadType: "form",
              responses: {
                201: {
                  description: "Updated todo by id.",
                  schema: todoSchema
                },
                400: {
                  description: "Validation failed."
                },
                403: {
                  description: "Authorization required."
                },
                404: {
                  description: "Todo for this ID do not exist."
                }
              },
              order: 4
            }
          }
        }
      },
      {
        method: "DELETE",
        path: this.apiVersion + "/todos/{id}",
        options: {
          handler: this.todoController.deleteTodoById.bind(this.todoController),
          validate: {
            params: this.getValidateRules({
              name: "id",
              required: true,
              description: "Task id"
            })
          },
          description: "Delete the todo by id",
          notes: "Returns deleted todo by id",
          tags: ["api", "todos"],
          plugins: {
            "hapi-swagger": {
              responses: {
                201: {
                  description: "Deleted todo by id.",
                  schema: todoSchema
                },
                400: {
                  description: "Validation failed."
                },
                403: {
                  description: "Authorization required."
                },
                404: {
                  description: "Todo for this ID do not exist."
                }
              },
              order: 5
            }
          }
        }
      }
    ];
  }
}
