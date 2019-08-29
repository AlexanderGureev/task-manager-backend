import * as bcrypt from "bcrypt";
import * as mongoose from "mongoose";
import { IUserModel, Providers } from "../interfaces/user.interface";

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

const userSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      required: true,
      default: Providers.local
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String
    },
    email: {
      unique: true,
      type: String,
      required: true
    },
    categories: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "categories" }],
      default: []
    },
    avatarPath: {
      type: String,
      default: "/upload/ava_default.png"
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret._id;
        delete ret.password;
        delete ret.provider;
        return { ...ret, id: doc._id };
      }
    }
  }
);

userSchema.methods.hashPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};
userSchema.methods.comparePassword = async function(hash, password) {
  const isValid = await bcrypt.compare(password, hash);
  return isValid;
};

const usersModel = mongoose.model<IUserModel>("users", userSchema);

export { usersModel };
