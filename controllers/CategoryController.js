const Categories = require("../modles/categariesSchema");
const AppError = require("../utils/AppError");
exports.getallCategories = async (req, res, next) => {
  try {
    const categories = await Categories.find();
    res.status(200).json({ categories });
  } catch (err) {
    console.error(err);
  }
};
exports.addCategory = async (req, res, next) => {
  try {
    const user = req.user || {};
    if (!user || user.role !== "admin") {
      throw new AppError("You Are Not Allowed To Do This.", 403);
    }
    const { name, count, image } = req.body || {};
    if (!name || count || !image) {
      throw new AppError(
        "Please Provide (name & count = 0 & image) for the category",
        400
      );
    }
    const check = await Categories.findOne({ name });
    if (check) {
      throw new AppError("This Category Exists!", 400);
    }
    const cat = await Categories.create({
      name,
      count,
      image,
    });
    res
      .status(201)
      .json({ status: "Success", message: "Added The New Category!" });
  } catch (err) {
    next(err);
  }
};
exports.deleteCategory = async (req, res, next) => {
  try {
    const user = req.user || {};
    if (!user || user.role !== "admin") {
      throw new AppError("You Are Not Allowed To Do This.", 403);
    }
    const { name } = req.params || {};
    if (!name) {
      throw new AppError("Provide What You Want To Delete", 400);
    }
    const cat = await Categories.findOneAndDelete({ name });
    if (!cat) {
      throw new AppError("Category Not Found", 404);
    }
    res
      .status(201)
      .json({ status: "Success", message: "Category Deleted Successfuly" });
  } catch (err) {
    next(err);
  }
};
