const file = require("../modles/porductSchema");
const Products = file.Products;
const Catogaries = require("../modles/categariesSchema");
const Response = require("../middlerwares/Response");
const AppError = require("../utils/AppError");
const UploadImage = require("../middlerwares/Image_kit");
const Categories = require("../modles/categariesSchema");
exports.getAllProducts = async (req, res, next) => {
  try {
    const query = req.query.filter || 0;
    let Final = {};

    if (query) {
      Final["price"] = { $gte: query.min_price, $lte: query.max_price };
      Final["category"] = { $in: query.category };
      Final["rate"] = query.rate ? { $gte: query.rate } : { $gte: 0 };
    }
    console.log(query, Final);
    const products = await Products.find(Final).populate(
      "category",
      "name _id"
    );

    await Response(res, 200, products);
  } catch (err) {
    next(err);
  }
};
exports.getProductByName = async (req, res, next) => {
  try {
    let { name } = req.params || {};
    if (!name) {
      throw new AppError("Please Provide The Name OF the Product.", 400);
    }
    const product = await Products.findOne({ name })
      .collation({
        locale: "en",
        strength: 2,
      })
      .populate("category", "name _id");
    if (!product) {
      throw new AppError("Product Not Found", 404);
    }
    Response(res, 200, product);
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
    const { description, category, quantity, price, name } = req.body || {};
    if (!description || !category || !quantity || !price || !name) {
      throw new AppError("Make Sure You Added All The Data.", 400);
    }
    const checkName = await Products.findOne({ name });
    if (checkName) {
      throw new AppError("This Product Already Exists", 400);
    }
    const cat = await Catogaries.findOne({ _id: category });
    if (!cat) {
      throw new AppError("Catogery Does Not Exist.", 404);
    }
    const images = await UploadImage(req);
    if (!images) {
      throw new AppError(`"Image Is Empty" ${images}`, 500);
    }
    const catsname = cat.name;
    const product = await Products.create({
      description,
      category: catsname,
      images,
      quantity,
      price,
      name,
    });
    cat.products.push(product._id);
    cat.count += product.quantity;
    await cat.save();
    Response(res, 201, product);
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
    Response(res, 201, "Product Edited Succesfuly");
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
    const { id } = req.params || {};
    if (!id) {
      throw new AppError("Id not found Make Sure To add it after URL", 400);
    }
    const product = await Products.findOneAndDelete({ _id: id });
    if (!product) {
      throw new AppError("Product Not Found", 404);
    }
    const cat = await Categories.findById({ _id: product.category });
    cat.products = cat.products.filter(
      (id) => id.toString() !== product._id.toString()
    );
    await cat.save();
    Response(res, 200, "Product Deleted Successfuly");
  } catch (err) {
    next(err);
  }
};
