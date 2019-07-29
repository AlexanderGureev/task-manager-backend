import * as Joi from "@hapi/joi";
import { IRoute, IRouter } from "../interfaces/common.interface";
import { ITodoController } from "../interfaces/todo.interface";
import {
  listTodosByCategorySchema,
  listTodosSchema,
  todoSchema
} from "../schemas";

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
      categoryId: Joi.string()
        .min(24)
        .max(24),
      id: Joi.string()
        .min(24)
        .max(24),
      limit: Joi.number()
        .min(1)
        .max(100)
        .default(10),
      offset: Joi.number()
        .min(0)
        .default(0),
      text: Joi.string()
        .min(1)
        .default("text todo"),
      date: Joi.date(),
      primary: Joi.boolean(),
      status: Joi.string()
        .valid("active")
        .valid("completed")
    };

    return fields.reduce(
      (acc, { name, required = false, description = "", def }) => {
        const field = {
          [name]: validateFields[name].description(description || name)
        };

        if (required) {
          field[name] = field[name].required();
        }
        if (def) {
          field[name] = field[name].default(def);
        }

        return {
          ...field,
          ...acc
        };
      },
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
            query: this.getValidateRules(
              {
                name: "limit",
                description: "Number of tasks"
              },
              {
                name: "offset",
                description: "Offset"
              },
              {
                name: "primary",
                description: "Primary"
              },
              {
                name: "status",
                description: "Status todo"
              }
            )
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
        method: "GET",
        path: this.apiVersion + "/todos/{categoryId}",
        options: {
          handler: this.todoController.getTodosByCategory.bind(
            this.todoController
          ),
          validate: {
            params: this.getValidateRules({
              name: "categoryId",
              description: "Category id"
            }),
            query: this.getValidateRules(
              {
                name: "limit",
                description: "Number of tasks"
              },
              {
                name: "offset",
                description: "Offset"
              },
              {
                name: "primary",
                description: "Primary"
              },
              {
                name: "status",
                description: "Status todo"
              }
            )
          },
          auth: "jwt",
          description: "Get all todos by category",
          notes: "Returns all todos item",
          tags: ["api", "todos"],
          plugins: {
            "hapi-swagger": {
              responses: {
                200: {
                  description: "List of all todos by category.",
                  schema: listTodosByCategorySchema
                },
                400: {
                  description: "Validation failed."
                },
                403: {
                  description: "Authorization required."
                },
                404: {
                  description: "Todos for this category id do not exist."
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
              {
                name: "categoryId",
                required: true,
                description: "Category Id"
              },
              { name: "text", required: true, description: "Task description" },
              { name: "status", description: "Task status", def: "active" },
              { name: "primary", description: "Task priority", def: false },
              {
                name: "date",
                description: "Date of creation todo",
                def: Date.now()
              }
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
                  description: "The todo has been successfully created.",
                  schema: todoSchema
                },
                400: {
                  description: "Validation failed."
                },
                403: {
                  description: "Authorization required."
                },
                404: {
                  description: "Category for this ID do not exist."
                }
              },
              order: 3
            }
          }
        }
      },
      {
        method: "GET",
        path: this.apiVersion + "/todos/{categoryId}/{id}",
        options: {
          handler: this.todoController.getTodoById.bind(this.todoController),
          validate: {
            params: this.getValidateRules(
              {
                name: "id",
                required: true,
                description: "Task id"
              },
              {
                name: "categoryId",
                required: true,
                description: "Category Id"
              }
            )
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
        path: this.apiVersion + "/todos/{categoryId}/{id}",
        options: {
          handler: this.todoController.updateTodoById.bind(this.todoController),
          validate: {
            params: this.getValidateRules(
              {
                name: "id",
                required: true,
                description: "Task id"
              },
              {
                name: "categoryId",
                required: true,
                description: "Category Id"
              }
            ),
            payload: this.getValidateRules(
              { name: "text", description: "Task description" },
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
                204: {
                  description: "No content"
                },
                400: {
                  description: "Validation failed."
                },
                403: {
                  description: "Authorization required."
                }
              },
              order: 4
            }
          }
        }
      },
      {
        method: "DELETE",
        path: this.apiVersion + "/todos/{categoryId}/{id}",
        options: {
          handler: this.todoController.deleteTodoById.bind(this.todoController),
          validate: {
            params: this.getValidateRules(
              {
                name: "id",
                required: true,
                description: "Task id"
              },
              {
                name: "categoryId",
                required: true,
                description: "Category Id"
              }
            )
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
                204: {
                  description: "No content"
                },
                400: {
                  description: "Validation failed."
                },
                403: {
                  description: "Authorization required."
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
