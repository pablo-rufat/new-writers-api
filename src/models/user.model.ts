import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/interfaces";

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bookmark: {
    type: String,
    required: false
  },
  roles: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role"
      }
  ],
});

export default mongoose.model < IUser > ("User", UserSchema);