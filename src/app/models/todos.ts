import * as mongoose from "mongoose";
import { ITodoModel } from "../../interfaces";

const todosScheme = new mongoose.Schema({
  text: {
    type: String,
    required: true
  }
});

const todosModel = mongoose.model<ITodoModel>("todos", todosScheme);

export { todosModel };
