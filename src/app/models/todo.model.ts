import * as mongoose from "mongoose";
import { ITodoModel } from "../../interfaces";

const todosSchema = new mongoose.Schema(
  {
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
