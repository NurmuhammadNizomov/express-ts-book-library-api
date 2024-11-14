import { Document } from "mongoose";
import { ICategory } from "./ICategory";

export interface IBook extends Document {
  title: string;
  author: string;
  category: ICategory["_id"];
  description?: string;
  publishedDate: Date;
  price: number;
}
