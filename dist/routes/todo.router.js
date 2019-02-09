"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
class TodoRouter {
    constructor(todoController) {
        this.todoController = todoController;
        this.apiVersion = "/v1";
        this.setupRouter();
    }
    getRoutes() {
        return this.routes;
    }
    getValidateRules(...fields) {
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
        return fields.reduce((acc, { name, required = false, description = "" }) => (Object.assign({ [name]: required
                ? validateFields[name].required().description(description || name)
                : validateFields[name].description(description || name) }, acc)), {});
    }
    setupRouter() {
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
                        payload: this.getValidateRules({ name: "text", required: true, description: "Task decription" }, { name: "status", description: "Task status" }, { name: "primary", description: "Task priority" })
                    },
                    description: "Create a new todo",
                    notes: "Returns the created todo",
                    tags: ["api", "todos"],
                    plugins: {
                        "hapi-swagger": {
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
                        payload: this.getValidateRules({ name: "text", description: "Task decription" }, { name: "status", description: "Task status" }, { name: "primary", description: "Task priority" })
                    },
                    description: "Updates the todo by id",
                    notes: "Returns updated todo by id",
                    tags: ["api", "todos"],
                    plugins: {
                        "hapi-swagger": {
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
                            order: 5
                        }
                    }
                }
            }
        ];
    }
}
exports.TodoRouter = TodoRouter;
//# sourceMappingURL=todo.router.js.map