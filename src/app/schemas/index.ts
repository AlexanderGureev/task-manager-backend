import * as Joi from "@hapi/joi";

const categoriesListIds = Joi.array()
  .items(Joi.string())
  .label("Categories ids list");

const todosListIds = Joi.array()
  .items(Joi.number())
  .label("Todos ids list");

const userCreatedSchema = Joi.object({
  email: Joi.string(),
  username: Joi.string(),
  id: Joi.string(),
  categories: categoriesListIds
}).label("User created model");

const todoSchema = Joi.object({
  id: Joi.string(),
  categoryId: Joi.string(),
  text: Joi.string(),
  primary: Joi.boolean(),
  status: Joi.string(),
  date: Joi.date()
}).label("Todo model");

const shallowCategorySchema = Joi.object({
  id: Joi.string(),
  name: Joi.string(),
  author: Joi.string(),
  todos: todosListIds
}).label("Shallow category model");

const deepCategorySchema = Joi.object({
  id: Joi.string(),
  name: Joi.string(),
  author: Joi.string(),
  todos: Joi.array().items(todoSchema)
}).label("Deep category model");

const listTodosSchema = Joi.array()
  .items(deepCategorySchema)
  .label("Todo list model");

const listTodosByCategorySchema = Joi.object({
  id: Joi.string(),
  name: Joi.string(),
  author: Joi.string(),
  todos: Joi.array().items(todoSchema),
  todosCountByCategory: Joi.number()
}).label("Todo list by category model");

const listCategoriesSchema = Joi.array()
  .items(shallowCategorySchema)
  .label("Categories list model");

export {
  userCreatedSchema,
  todoSchema,
  listTodosSchema,
  listTodosByCategorySchema,
  deepCategorySchema,
  shallowCategorySchema,
  listCategoriesSchema
};
