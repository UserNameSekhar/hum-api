import mongoose from "mongoose";
import { IOrder } from "../models/IOrder";

const OrderSchema = new mongoose.Schema<IOrder>(
  {
    // products: [
    //   {
    //     _id: { type: String, required: true },
    //     title: { type: String, required: true },
    //     description: { type: String, required: true },
    //     imageUrl: { type: String, required: true },
    //     brand: { type: String, required: true },
    //     price: { type: String, required: true },
    //     quantity: { type: String, required: true },
    //     count: { type: Number, required: true },
    //     sold: { type: Number, required: true },
    //     categoryObj: {
    //       _id: { type: String, required: true },
    //       name: { type: String, required: true },
    //       description: { type: String, required: true },
    //       subCategories: { type: [String], required: true },
    //       createdAt: { type: String, required: true },
    //       updatedAt: { type: String, required: true },
    //     },
    //     subCategoryObj: {
    //       _id: { type: String, required: true },
    //       name: { type: String, required: true },
    //       description: { type: String, required: true },
    //     },
    //   },
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
    total: { type: Number, required: true },
    tax: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    paymentType: { type: String, required: true },
    orderStatus: {
      type: String,
      required: true,
      default: "Order Placed",
      enum: [
        "Order Placed",
        "Processing",
        "Dispatched",
        "Delivered",
        "Cancelled",
        "Completed",
      ],
    },
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
  },
  { timestamps: true }
);

const OrderCollection = mongoose.model<IOrder>("orders", OrderSchema);
export default OrderCollection;
