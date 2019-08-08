import * as Joi from "@hapi/joi";
import { ICategoryController } from "../interfaces/category.interface";
import { IRoute, IRouter } from "../interfaces/common.interface";
import { listCategoriesSchema, shallowCategorySchema } from "../schemas";

export class CategoryRouter implements IRouter {
  private routes: IRoute[];
  private apiVersion: string = "/v1";

  constructor(private categoryController: ICategoryController) {
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
      name: Joi.string().min(1),
      color: Joi.string()
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
        path: this.apiVersion + "/categories",
        options: {
          handler: this.categoryController.getCategories.bind(
            this.categoryController
          ),
          auth: "jwt",
          description: "Get all categories",
          notes: "Returns all categories",
          tags: ["api", "categories"],
          plugins: {
            "hapi-swagger": {
              responses: {
                200: {
                  description: "List of all categories.",
                  schema: listCategoriesSchema
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
        path: this.apiVersion + "/categories",
        options: {
          handler: this.categoryController.createCategory.bind(
            this.categoryController
          ),
          validate: {
            payload: this.getValidateRules({
              name: "name",
              required: true,
              description: "Category name"
            })
          },
          description: "Create a new category",
          notes: "Returns the created category",
          tags: ["api", "categories"],
          plugins: {
            "hapi-swagger": {
              payloadType: "form",
              responses: {
                201: {
                  description: "The category has been successfully created.",
                  schema: shallowCategorySchema
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
        path: this.apiVersion + "/categories/{id}",
        options: {
          handler: this.categoryController.getCategoryById.bind(
            this.categoryController
          ),
          validate: {
            params: this.getValidateRules({
              name: "id",
              required: true,
              description: "Category id"
            })
          },
          description: "Get a category by id",
          notes: "Returns category by id",
          tags: ["api", "categories"],
          plugins: {
            "hapi-swagger": {
              responses: {
                200: {
                  description: "Category by id.",
                  schema: shallowCategorySchema
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
              order: 2
            }
          }
        }
      },
      {
        method: "PATCH",
        path: this.apiVersion + "/categories/{id}",
        options: {
          handler: this.categoryController.updateCategoryById.bind(
            this.categoryController
          ),
          validate: {
            params: this.getValidateRules({
              name: "id",
              required: true,
              description: "Category id"
            }),
            payload: this.getValidateRules(
              {
                name: "name",
                description: "Category name"
              },
              {
                name: "color",
                description: "Category color"
              }
            )
          },
          description: "Updates the category by id",
          notes: "Returns updated category by id",
          tags: ["api", "categories"],
          plugins: {
            "hapi-swagger": {
              payloadType: "form",
              responses: {
                200: {
                  description: "Updated category by id.",
                  schema: shallowCategorySchema
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
        path: this.apiVersion + "/categories/{id}",
        options: {
          handler: this.categoryController.deleteCategoryById.bind(
            this.categoryController
          ),
          validate: {
            params: this.getValidateRules({
              name: "id",
              required: true,
              description: "Category id"
            })
          },
          description: "Delete the category by id",
          notes: "Returns deleted category by id",
          tags: ["api", "categories"],
          plugins: {
            "hapi-swagger": {
              responses: {
                200: {
                  description: "Deleted category by id.",
                  schema: shallowCategorySchema
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
