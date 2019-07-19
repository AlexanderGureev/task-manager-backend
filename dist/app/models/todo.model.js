"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
const todosSchema = new mongoose.Schema({
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
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
            delete ret._id;
            return Object.assign({}, ret, { id: doc._id });
        }
    }
});
const todosModel = mongoose.model("todos", todosSchema);
exports.todosModel = todosModel;
//# sourceMappingURL=todo.model.js.map