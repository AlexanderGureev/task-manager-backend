import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  ITodo,
  ITodoController,
  ITodoService
} from "../interfaces/todo.interface";

export class TodoController implements ITodoController {
  constructor(public todoService: ITodoService) {}

  public async addTodo(req: Request, h: ResponseToolkit) {
    try {
      const { userId }: any = req.auth.credentials;
      const todo: ITodo = await this.todoService.addTodo(
        userId,
        req.payload as ITodo
      );
      return h.response(todo).code(201);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  public async updateTodoById(req: Request, h: ResponseToolkit) {
    try {
      const { userId }: any = req.auth.credentials;
      const updatedTodo = await this.todoService.updateTodoById(
        userId,
        req.params.id,
        req.payload as ITodo
      );
      if (!updatedTodo) {
        return h.response().code(204);
      }
      return h.response(updatedTodo).code(200);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  public async deleteTodoById(req: Request, h: ResponseToolkit) {
    try {
      const { userId }: any = req.auth.credentials;
      const deletedTodo = await this.todoService.deleteTodoById(
        userId,
        req.params.id
      );
      if (!deletedTodo) {
        return h.response().code(204);
      }
      return h.response(deletedTodo).code(200);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  public async getTodosByCategory(req: Request, h: ResponseToolkit) {
    try {
      const todos = await this.todoService.getTodosByCategory(
        req.params.categoryId,
        req.query
      );
      return h.response(todos).code(200);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  public async getTodos(req: Request, h: ResponseToolkit) {
    try {
      const todos = await this.todoService.getTodos(
        req.query,
        req.auth.credentials
      );
      return h.response(todos).code(200);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  public async getTodoById(req: Request, h: ResponseToolkit) {
    try {
      const todo = await this.todoService.getTodoById(req.params.id);
      return h.response(todo).code(200);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  public async updatePositionTodosByCategory(req: Request, h: ResponseToolkit) {
    try {
      const updatedTodos = await this.todoService.updatePositionTodosByCategory(
        req.params.categoryId,
        req.payload as any
      );
      if (!updatedTodos) {
        return h.response().code(204);
      }
      return h.response(updatedTodos).code(200);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
