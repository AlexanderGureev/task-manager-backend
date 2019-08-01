import * as Joi from "@hapi/joi";

const categoriesListIds = Joi.array()
  .items(Joi.string())
  .label("Categories ids list");

const todosListIds = Joi.array()
  .items(Joi.string())
  .label("Todos ids list");

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

const userSchema = Joi.object({
  email: Joi.string(),
  username: Joi.string(),
  id: Joi.string(),
  categories: listCategoriesSchema,
  avatarPath: Joi.string()
}).label("User model");

const userCreatedSchema = Joi.object({
  email: Joi.string(),
  username: Joi.string(),
  id: Joi.string(),
  categories: categoriesListIds,
  avatarPath: Joi.string()
}).label("User created model");

const uploadedFileSchema = Joi.object({
  originalFilename: Joi.string(),
  filename: Joi.string(),
  path: Joi.string()
}).label("Uploaded file model");

const removedFileSchema = Joi.object({
  filename: Joi.string()
}).label("Removed file model");

export {
  userCreatedSchema,
  userSchema,
  todoSchema,
  listTodosSchema,
  listTodosByCategorySchema,
  deepCategorySchema,
  shallowCategorySchema,
  listCategoriesSchema,
  uploadedFileSchema,
  removedFileSchema
};
