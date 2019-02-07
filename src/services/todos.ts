import { IDatabase, ITodo, ITodoService } from "../interfaces";

class TodoService implements ITodoService {
  constructor(private db: IDatabase) {}
  public addTodo = async (todo: ITodo) => {
    try {
      const newTodo = new this.db.todosModel({ text: todo.text });
      return await newTodo.save();
    } catch (error) {
      console.log(error);
    }
  };
  public getTodos = async (): Promise<ITodo[]> => {
    try {
      const allTodos: ITodo[] = await this.db.todosModel.find({});
      return allTodos;
    } catch (error) {
      console.log(error);
    }
  };
}

export { TodoService };
