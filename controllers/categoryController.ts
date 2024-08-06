import { Request, Response } from "express";
import { ThrowError } from "../utils/ErrorUtil";
import * as UserUtil from "../utils/UserUtil";
import { ICategory, ISubCategory } from "../models/ICategory";
import {
  CategoryCollection,
  SubCategoryCollection,
} from "../schemas/CategorySchema";
import { APP_CONSTANTS } from "../constants";
import mongoose from "mongoose";

/**
 * @usage : Create a Category
 * @url : http://localhost:9000/api/categories/
 * @params : name, description
 * @method : POST
 * @access : PRIVATE
 */
export const createCategory = async (request: Request, response: Response) => {
  try {
    const { name, description } = request.body;
    const theUser: any = await UserUtil.getUser(request, response);
    if (theUser) {
      //Check if the category is exists or not
      const categoryObj: ICategory | undefined | null =
        await CategoryCollection.findOne({ name: name });
      if (categoryObj) {
        return ThrowError(response, 404, "This Cateogry is Already Exists");
      }

      //Create
      const theCategory: ICategory = {
        name: name,
        description: description,
        subCategories: [] as ISubCategory[],
      };
      const savedCategory = await new CategoryCollection(theCategory).save();
      if (savedCategory) {
        return response.status(200).json({
          status: APP_CONSTANTS.SUCCESS,
          data: savedCategory,
          msg: "New Category is Created!",
        });
      }
    }
  } catch (error) {
    return ThrowError(response);
  }
};

/**
 * @usage : Create a Sub Category
 * @url : http://localhost:9000/api/categories/:categoryId
 * @params : name, description
 * @method : POST
 * @access : PRIVATE
 */
export const createSubCategory = async (
  request: Request,
  response: Response
) => {
  try {
    const { categoryId } = request.params;
    const mongoCategoryId = new mongoose.Types.ObjectId(categoryId);
    const { name, description } = request.body;
    const theUser: any = await UserUtil.getUser(request, response);
    if (theUser) {
      //Check if the sub category exists or not
      let theCategory: any = await CategoryCollection.findById(mongoCategoryId);
      if (!theCategory) {
        return ThrowError(response, 404, "Category is already Exists");
      }

      let theSubCategory: any = await SubCategoryCollection.findOne({
        name: name,
      });
      if (theSubCategory) {
        return ThrowError(response, 404, "Sub Category is already Exists");
      }

      let theSub = await new SubCategoryCollection({
        name: name,
        description: description,
      }).save();

      if (theSub) {
        theCategory.subCategories.push(theSub);
        let categoryObj = await theCategory.save();

        if (categoryObj) {
          return response.status(201).json({
            msg: "Sub Category is Created!",
            status: APP_CONSTANTS.SUCCESS,
            data: theCategory,
          });
        }
      }
    }
  } catch (error) {
    return ThrowError(response);
  }
};

/**
 * @usage : Get all Categories
 * @url : http://localhost:9000/api/categories/
 * @params : no-params
 * @method : GET
 * @access : PUBLIC
 */
export const getAllCategories = async (
  request: Request,
  response: Response
) => {
  try {
    const categories = await CategoryCollection.find().populate({
      path: "subCategories",
      strictPopulate: false,
    });
    return response.status(200).json({
      status: APP_CONSTANTS.SUCCESS,
      data: categories,
      msg: "All Categories",
    });
  } catch (error) {
    return ThrowError(response);
  }
};
