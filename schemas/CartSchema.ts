import mongoose from "mongoose";
import { ICart } from "../models/ICart";

const CartSchema = new mongoose.Schema<ICart>(
  {
    // products: [
    //     {
    //         _id: { type: String, required: true },
    //         title: { type: String, required: true },
    //         description: { type: String, required: true },
    //         imageUrl: { type: String, required: true },
    //         brand: { type: String, required: true },
    //         price: { type: String, required: true },
    //         quantity: { type: String, required: true },
    //         count: { type: Number, required: true},
    //         sold: { type: Number, required: true},
    //         categoryObj: {
    //             _id: { type: String, required: true },
    //             name: { type: String, required: true},
    //             description: { type: String, required: true },
    //             subCategories: { type: [String], required: true },
    //             createdAt: { type: String, required: true },
    //             updatedAt: { type: String, required: true },
    //         },
    //         subCategoryObj: {
    //             _id: { type: String, required: true },
    //             name: { type: String, required: true},
    //             description: { type: String, required: true },
    //         },
    //       }
    // ],
    
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "products",
        },
        count: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    total: { type: String, required: true },
    tax: { type: String, required: true },
    grandTotal: { type: String, required: true },
    userObj: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
  },
  { timestamps: true }
);

const CartCollection = mongoose.model<ICart>("carts", CartSchema);
export default CartCollection;
