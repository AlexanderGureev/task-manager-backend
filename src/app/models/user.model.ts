import * as bcrypt from "bcrypt";
import * as mongoose from "mongoose";
import { IUserModel } from "../../interfaces";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      unique: true,
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret._id;
        delete ret.password;
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
