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
  status: Joi.string()
}).label("Todo model");

const listTodosSchema = Joi.array()
  .items(todoSchema)
  .label("Todo list model");

export { userCreatedSchema, listTodosSchema, todoSchema };
