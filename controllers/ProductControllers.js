const file = require("../modles/porductSchema");
const Products = file.Products;
const Catogaries = require("../modles/categariesSchema");
const AppError = require("../utils/AppError");
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Products.find();
    res.status(200).json({ products });
  } catch (err) {
    next(err);
  }
};
exports.getProductByName = async (req, res, next) => {
  try {
    const { name } = req.params || {};
    if (!name) {
      throw new AppError("Please Provide The Name OF the Product.", 400);
    }
    const product = await Products.findOne({ name });
    if (!product) {
      throw new AppError("Product Not Found", 404);
    }
    res.status(200).json({ product });
  } catch (err) {
    next(err);
  }
};
exports.addNewProduct = async (req, res, next) => {
  try {
    const user = req.user || {};
    if (!user || user.role !== "admin") {
      throw new AppError("You Are Not Allowed To Do This.", 403);
    }
    const { description, category, quantity, price, images, name } =
      req.body || {};
    if (!description || !category || !quantity || !price || !images || !name) {
      throw new AppError("Make Sure You Added All The Data.", 400);
    }
    const checkName = await Products.findOne({ name });
    if (checkName) {
      throw new AppError("This Product Already Exists", 400);
    }
    const cat = await Catogaries.findOne({ name: category });
    if (!cat) {
      throw new AppError("Catogery Does Not Exist.", 404);
    }
    const product = await Products.create({
      description,
      category,
      quantity,
      price,
      images,
      name,
    });
    cat.products.push(product._id);
    cat.count += product.quantity;
    await cat.save();
    res
      .status(201)
      .json({ status: "Success", message: "Product Created.", product });
  } catch (err) {
    next(err);
  }
};
exports.updateProduct = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user || user.role !== "admin") {
      throw new AppError("You Are Not Allowed To Do This.", 403);
    }
    const { name } = req.body;
    const product = Products.findOneAndUpdate({ name });
    if (!product) {
      throw new AppError("Product Not Found", 404);
    }
    res
      .status(201)
      .json({ status: "Success", message: "Product Edited Succesfuly" });
  } catch (err) {
    next(err);
  }
};
exports.deleteProduct = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user || user.role !== "admin") {
      throw new AppError("You Are Not Allowed To Do This.", 403);
    }
    const { name } = req.params || {};
    if (!name) {
      throw new AppError("Id not found Make Sure To add it after URL", 400);
    }
    const product = Products.findOneAndDelete({ name });
    if (!product) {
      throw new AppError("Product Not Found", 404);
    }
    res.status(200).json({ message: "Product Deleted Successfuly" });
  } catch (err) {
    next(err);
  }
};
