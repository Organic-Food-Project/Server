const { not } = require("joi");
const Response = require("../middlerwares/Response");
const file = require("../modles/porductSchema");
const Products = file.Products;
const AppError = require("../utils/AppError");

exports.addToWishList = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw new AppError("Please Make Sure LogIn", 403);
    }
    const { productID } = req.body || {};
    if (!productID) {
      throw new AppError("Please Make Sure You provide The productID", 404);
    }
    const product = await Products.findById(productID);
    if (!product) {
      throw new AppError("Product Not Found", 404);
    }
    if (user.WishList.includes(productID)) {
      return Response(res, 400, "This Product Already exists in Your WishList");
    }
    user.WishList.push(productID);
    await user.save();
    return Response(res, 201, user.WishList);
  } catch (err) {
    next(err);
  }
};

exports.deleteFromWishList = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw new AppError("Please Make Sure LogIn", 403);
    }
    const { productID } = req.body || {};
    if (!productID) {
      throw new AppError("Please Make Sure You provide The productID", 404);
    }
    const product = await Products.findById(productID);
    if (!product) {
      throw new AppError("Product Not Found", 404);
    }
    if (!user.WishList.includes(productID)) {
      return Response(res, 400, "This Product Is not In Your WishList.");
    }
    user.WishList = user.WishList.filter((el) => el != productID);
    user.markModified("WishList");
    await user.save();
    return Response(res, 200, "Deleted Successfuly");
  } catch (err) {
    next(err);
  }
};
