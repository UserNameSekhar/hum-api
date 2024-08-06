import mongoose from "mongoose";
import { ICategory, ISubCategory } from "../models/ICategory";

//Child Schema
const SubCategorySchema = new mongoose.Schema<ISubCategory>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
});

export const SubCategoryCollection = mongoose.model<ISubCategory>(
  "subCategories",
  SubCategorySchema
);

//Parent Schema
const CategorySchema = new mongoose.Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subCategories",
      },
    ],
  },
  { timestamps: true }
);

export const CategoryCollection = mongoose.model<ICategory>(
  "categories",
  CategorySchema
);
