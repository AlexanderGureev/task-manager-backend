import * as mongoose from "mongoose";
import { ITodoModel } from "../interfaces/todo.interface";

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

const todosSchema = new mongoose.Schema(
  {
    categoryId: mongoose.Schema.Types.ObjectId,
    text: {
      type: String,
      required: true
    },
    primary: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: "active"
    },
    date: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret._id;
        return { ...ret, id: doc._id };
      }
    }
  }
);

const todosModel = mongoose.model<ITodoModel>("todos", todosSchema);

export { todosModel };
