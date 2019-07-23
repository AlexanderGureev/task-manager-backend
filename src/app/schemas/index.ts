import * as Joi from "@hapi/joi";

const userCreatedSchema = Joi.object({
  email: Joi.string(),
  username: Joi.string(),
  id: Joi.string()
}).label("User created model");

const todoSchema = Joi.object({
  id: Joi.string(),
  text: Joi.string(),
  primary: Joi.boolean(),
  status: Joi.string(),
  date: Joi.date()
}).label("Todo model");

const categorySchema = Joi.object({
  id: Joi.string(),
  name: Joi.string(),
  author: Joi.string(),
  todos: Joi.array().items(Joi.string())
}).label("Category model");

const listTodosSchema = Joi.object({
  todos: Joi.array().items(todoSchema),
  countTodos: Joi.number()
}).label("Todo list model");

const listCategoriesSchema = Joi.object({
  categories: Joi.array().items(categorySchema)
}).label("Categories list model");

export {
  userCreatedSchema,
  listTodosSchema,
  todoSchema,
  categorySchema,
  listCategoriesSchema
};
