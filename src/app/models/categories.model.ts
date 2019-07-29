import * as mongoose from "mongoose";
import { ICategoryModel } from "../interfaces/category.interface";

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
mongoose.set("toJSON", { virtuals: true });

const categoriesSchema = new mongoose.Schema(
  {
    name: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },
    todos: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "todos" }]
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

categoriesSchema.virtual("todosCountByCategory", {
  ref: "todos",
  localField: "_id",
  foreignField: "categoryId",
  count: true
});

const categoriesModel = mongoose.model<ICategoryModel>(
  "categories",
  categoriesSchema
);

export { categoriesModel };
