import { Request, Response } from "express";
import { ThrowError } from "../utils/ErrorUtil";
import * as UserUtil from "../utils/UserUtil";
import CartCollection from "../schemas/CartSchema";
import { ICart } from "../models/ICart";
import mongoose from "mongoose";
import { APP_CONSTANTS } from "../constants";
import ProductCollection from "../schemas/ProductSchema";

/**
 * @usage : Create a Cart
 * @url : http://localhost:9000/api/carts/
 * @params : products[{product, count, price}], total, tax, grandTotal
 * @method : POST
 * @access : PRIVATE
 */
export const createCart = async (request: Request, response: Response) => {
  try {
    const theUser: any = await UserUtil.getUser(request, response);
    if (theUser) {
      const { products, total, tax, grandTotal } = request.body;

      //Check if user already have a cart
      const cart = await CartCollection.findOne({ userObj: theUser._id });
      if (cart) {
        await CartCollection.findOneAndDelete({ userObj: theUser._id });
      }

      const newCart: ICart = {
        products: products,
        total: total,
        tax: tax,
        grandTotal: grandTotal,
        userObj: theUser._id,
      };

      const theCart = await new CartCollection(newCart).save();

      if (!theCart) {
        return ThrowError(response, 400, "Cart Creation is Failed!");
      }

      const actualCart = await CartCollection.findById(
        new mongoose.Types.ObjectId(theCart._id)
      ).populate({
        path: "userObj",
        strictPopulate: false,
      });

      return response.status(200).json({
        status: APP_CONSTANTS.SUCCESS,
        msg: "Cart is created Successfully!",
        data: actualCart,
      });
    }
  } catch (error) {
    return ThrowError(response);
  }
};

/**
 * @usage : Get Cart Info
 * @url : http://localhost:9000/api/carts/me
 * @params : no-params
 * @method : GET
 * @access : PRIVATE
 */
// export const getCartInfo = async (request: Request, response: Response) => {
//   try {
//     const theUser: any = await UserUtil.getUser(request, response);
//     if (theUser) {
//       const theCart: any = await CartCollection.findOne({
//         userObj: new mongoose.Types.ObjectId(theUser._id),
//       }).populate({
//         path: "products.product",
//         strictPopulate: false,
//       }).populate({
//         path: "userObj",
//         strictPopulate: false,
//       });

//       return response.status(200).json({
//         status: APP_CONSTANTS.SUCCESS,
//         msg: "Cart Info",
//         data: theCart,
//       });
//     }
//   } catch (error) {
//     return ThrowError(response);
//   }
// };

export const getCartInfo = async (request: Request, response: Response) => {
  try {
    const theUser: any = await UserUtil.getUser(request, response);
    if (theUser) {
      const theCart: any = await CartCollection.findOne({
        userObj: new mongoose.Types.ObjectId(theUser._id),
      })
        .populate({
          path: "products.product", // Ensure this matches the field name in your schema
          strictPopulate: false,
        })
        .populate({
          path: "userObj",
          strictPopulate: false,
        });

      return response.status(200).json({
        status: APP_CONSTANTS.SUCCESS,
        msg: "Cart Info",
        data: theCart,
      });
    } else {
      return response.status(404).json({
        status: APP_CONSTANTS.FAILED,
        msg: "User not found",
      });
    }
  } catch (error) {
    console.error("Error fetching cart info:", error);
    return ThrowError(response);
  }
};
