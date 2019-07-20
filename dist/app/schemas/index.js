"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const userCreatedSchema = Joi.object({
    email: Joi.string(),
    username: Joi.string(),
    id: Joi.string()
}).label("User created model");
exports.userCreatedSchema = userCreatedSchema;
const todoSchema = Joi.object({
    id: Joi.string(),
    text: Joi.string(),
    primary: Joi.boolean(),
    status: Joi.string()
}).label("Todo model");
exports.todoSchema = todoSchema;
const listTodosSchema = Joi.array()
    .items(todoSchema)
    .label("Todo list model");
exports.listTodosSchema = listTodosSchema;
//# sourceMappingURL=index.js.map