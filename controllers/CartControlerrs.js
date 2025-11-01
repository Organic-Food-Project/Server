const User = require("../modles/userSchema");
const Response = require("../middlerwares/Response");
const file = require("../modles/porductSchema");
const Products = file.Products;
const AppError = require("../utils/AppError");

exports.Getcart = async (req, res, next) => {
  // name price images quantity
  const user = req.user;
  if (!user) {
    throw new AppError("Make Sure You LogIn", 404);
  }
  if (req.user.Cart) {
    const cart = await Promise.all(
      req.user.Cart.map(async (el) => {
        const product = await Products.findById(el.productID).select(
          "name images price"
        );
        return {
          name: product.name,
          price: product.price,
          images: product.images,
          quantity: el.quantity,
        };
      })
    );
    return Response(res, 200, cart);
  }
  return Response(res, 400, "Cart is Empty");
};
exports.AddToCart = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw new AppError("Make Sure You LogIn", 404);
    }
    const { productID, number } = req.body || {};
    const product = await Products.findById(productID);
    if (!productID || !number) {
      throw new AppError("Please Provide the productID and the number", 400);
    }
    if (!product) {
      throw new AppError("Product Not Found", 404);
    }
    const quantity = Number(number);
    if (quantity > product.quantity * 1) {
      throw new AppError(
        `We Don't have That Many Of this Product (${product.name})`,
        400
      );
    }
    const check = user.Cart.find((el) => el.productID === productID);
    if (check) {
      throw new AppError("This Product already In Your Cart", 400);
    }
    user.Cart.push({
      productID,
      quantity,
    });
    await user.save();
    return Response(res, 201, user.Cart);
  } catch (err) {
    next(err);
  }
};

exports.UpdateCart = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) throw new AppError("Make Sure You LogIn", 404);

    const { productID, number } = req.body || {};
    if (!productID || !number)
      throw new AppError("Please provide ProductID and Number", 400);

    const product = await Products.findById(productID);
    if (!product) throw new AppError("Product Not Found", 404);

    const quantity = Number(number);
    if (quantity > product.quantity)
      throw new AppError(
        `We Don't have That Many Of this Product   ${product.name}`,
        400
      );

    let edited = false;
    user.Cart.forEach((el) => {
      if (el.productID === productID) {
        el.quantity = quantity;
        edited = true;
      }
    });
    user.markModified("Cart");
    await user.save();

    if (edited) return Response(res, 200, user.Cart);
    return Response(
      res,
      400,
      "Product not found in Cart. Please add it first."
    );
  } catch (err) {
    next(err);
  }
};

exports.DeleteFromCart = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw new AppError("Make Sure You LogIn", 404);
    }

    const { productID } = req.body || {};
    if (!productID) {
      throw new AppError(
        "Please Make Sure to provide the ProductID and the Number",
        400
      );
    }
    const product = await Products.findById(productID);
    if (!product) {
      throw new AppError("Product Not Found!", 404);
    }
    const oldSize = user.Cart.length;
    user.Cart = user.Cart.filter((el) => el.productID != productID);
    await user.save();
    if (user.Cart.length < oldSize) {
      return Response(res, 200, "Product Deleted From Cart.");
    } else {
      return Response(
        res,
        400,
        "Product Not Found (this product does not seem to be in your Cart)"
      );
    }
  } catch (err) {
    next(err);
  }
};
