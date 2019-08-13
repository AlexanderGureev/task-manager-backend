import * as Boom from "@hapi/boom";
import { Types } from "mongoose";

import { ICategory } from "../interfaces/category.interface";
import { IDatabase } from "../interfaces/common.interface";
import { ITodo, ITodoService } from "../interfaces/todo.interface";

class TodoService implements ITodoService {
  constructor(private db: IDatabase) {}

  public addTodo = async (todo: ITodo) => {
    const { categoryId } = todo;
    const category = await this.db.categoriesModel.findById(categoryId).exec();

    if (!category) {
      throw Boom.notFound("Category for this ID do not exist.");
    }
    const newTodo = new this.db.todosModel(todo);
    category.todos.push(Types.ObjectId(newTodo._id));
    const [createdTodo] = await Promise.all([newTodo.save(), category.save()]);
    return createdTodo;
  };

  public getTodosByCategory = async (categoryId, query): Promise<ICategory> => {
    const filterOptions = ["primary", "status"];
    const filterQuery = Object.keys(query)
      .filter(key => filterOptions.includes(key))
      .reduce((acc, key) => ({ ...acc, [key]: { $eq: query[key] } }), {});

    let todos;
    let count = 0;

    if (Object.keys(filterQuery).length) {
      [todos, count] = await Promise.all([
        this.db.categoriesModel
          .findById(categoryId)
          .populate({
            path: "todos",
            match: filterQuery
          })
          .select({
            todos: {
              $slice: [query.offset, query.limit]
            }
          })
          .exec(),
        this.db.todosModel
          .find({ categoryId, ...filterQuery })
          .countDocuments()
          .exec()
      ]);
      todos.todosCountByCategory = count;
    } else {
      todos = await this.db.categoriesModel
        .findById(categoryId)
        .populate("todos")
        .populate("todosCountByCategory")
        .select({
          todos: {
            $slice: [query.offset, query.limit]
          }
        })
        .exec();
    }

    if (!todos) {
      throw Boom.notFound("Todos for this category id do not exist.");
    }
    return todos;
  };

  public getTodos = async (query, { userId }): Promise<ICategory[]> => {
    const filterOptions = ["primary", "status"];
    const filterQuery = Object.keys(query)
      .filter(key => filterOptions.includes(key))
      .reduce((acc, key) => ({ ...acc, [key]: { $eq: query[key] } }), {});

    const todos = await this.db.categoriesModel
      .find({ author: userId })
      .populate({
        path: "todos",
        match: filterQuery,
        options: { limit: query.limit, skip: query.offset }
      })
      .exec();

    return todos;
  };

  public getTodoById = async (id: string): Promise<ITodo> => {
    const todoById: ITodo = await this.db.todosModel.findById(id).exec();
    if (!todoById) {
      throw Boom.notFound("Todo for this ID do not exist.");
    }
    return todoById;
  };
  public updateTodoById = async (id: string, todo: ITodo): Promise<ITodo> => {
    const updatedTodo: ITodo = await this.db.todosModel
      .findByIdAndUpdate(id, { ...todo }, { new: true })
      .exec();
    return updatedTodo;
  };
  public deleteTodoById = async (id: string): Promise<ITodo> => {
    const deletedTodo: ITodo = await this.db.todosModel
      .findByIdAndDelete(id)
      .exec();
    return deletedTodo;
  };

  public updatePositionTodosByCategory = async (
    categoryId,
    todos
  ): Promise<Types.ObjectId[]> => {
    const categoryById = await this.db.categoriesModel
      .findById(categoryId)
      .exec();
    const convertedIdsToObjectId = todos.map(Types.ObjectId);
    categoryById.todos = convertedIdsToObjectId.concat(
      categoryById.todos.filter((_, i) => i > todos.length - 1)
    );

    const { todos: updatedTodosIds } = await categoryById.save();
    return updatedTodosIds;
  };
}

export { TodoService };
