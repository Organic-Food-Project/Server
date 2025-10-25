const file = require("../modles/porductSchema");
const Products = file.Products;
const Catogaries = require("../modles/categariesSchema");
const Response = require("../middlerwares/Response");
const AppError = require("../utils/AppError");
const UploadImage = require("../middlerwares/Image_kit");
const Categories = require("../modles/categariesSchema");
exports.getAllProducts = async (req, res, next) => {
  try {
    let Final = {};
    // Filter
    if (req.query.filter) {
      const query = req.query.filter;
      if (query.min_price && query.max_price) {
        Final["price"] = { $gte: query.min_price, $lte: query.max_price };
      }
      if (query.category) {
        Final["category"] = { $in: query.category };
      }
      if (query.rate) {
        Final["rate"] = query.rate ? { $gte: query.rate } : { $gte: 0 };
      }
    }
    let products = Products.find(Final).populate("category", "name _id");
    // Sort
    if (req.query.sort) {
      let sort = req.query.sort;
      sort = sort.replaceAll(",", " ");
      products = products.sort(sort);
    } else {
      products = products.sort("-createdAt");
    }
    // Limit Fields
    if (req.query.fields) {
      let fields = req.query.fields.split(",").join(" ");
      products = products.select(fields);
    } else {
      products = products.select("-__v");
    }
    //Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    products = products.skip(skip).limit(limit);

    if (req.query.page) {
      if (skip >= productCount) {
        throw new AppError("Products Not Found", 404);
      }
    }
    const finish = await products;
    res.status(200).json({
      data: finish,
      meta: {
        limit,
        total: finish.length,
      },
    });
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
      category,
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
    const { id } = req.params;
    const product = await Products.findByIdAndUpdate({ _id: id }, req.body);
    if (!product) {
      throw new AppError("Product Not Found", 404);
    }
    Response(res, 200, product);
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
