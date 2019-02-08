import { IDatabase, ITodo, ITodoService } from "../interfaces";

class TodoService implements ITodoService {
  constructor(private db: IDatabase) {}
  public addTodo = async (todo: ITodo) => {
    try {
      const newTodo = new this.db.todosModel({ ...todo });
      return await newTodo.save();
    } catch (error) {
      console.log(error);
    }
  };
  public getTodos = async (limit: number): Promise<ITodo[]> => {
    try {
      const allTodos: ITodo[] = await this.db.todosModel
        .find({})
        .limit(limit)
        .exec();
      return allTodos;
    } catch (error) {
      console.log(error);
    }
  };
  public getTodoById = async (id: string): Promise<ITodo> => {
    try {
      const todoById: ITodo = await this.db.todosModel.findById(id).exec();
      return todoById;
    } catch (error) {
      console.log(error);
    }
  };
  public updateTodoById = async (id: string, todo: ITodo): Promise<ITodo> => {
    try {
      const updatedTodo: ITodo = await this.db.todosModel
        .findByIdAndUpdate(id, { ...todo }, { new: true })
        .exec();
      return updatedTodo;
    } catch (error) {
      console.log(error);
    }
  };
  public deleteTodoById = async (id: string): Promise<ITodo> => {
    try {
      const deletedTodo: ITodo = await this.db.todosModel
        .findByIdAndDelete(id)
        .exec();
      return deletedTodo;
    } catch (error) {
      console.log(error);
    }
  };
}

export { TodoService };
