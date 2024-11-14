import mongoose, { Schema } from "mongoose";
import { ICategory } from "../interfaces";

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Category = mongoose.model<ICategory>("Category", CategorySchema);

export { Category };
