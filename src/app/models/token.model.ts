import * as mongoose from "mongoose";
import { ITokenModel } from "../interfaces/token.interface";

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

const tokenSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  expiresIn: {
    type: Number,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  }
});

const tokenModel = mongoose.model<ITokenModel>("token", tokenSchema);

export { tokenModel };
