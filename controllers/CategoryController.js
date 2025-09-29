const Categories = require("../modles/categariesSchema");
const Response = require("../middlerwares/Response");
const AppError = require("../utils/AppError");
const UploadImage = require("../middlerwares/Image_kit");
exports.getallCategories = async (req, res, next) => {
  try {
    const categories = await Categories.find();
    Response(res, 200, categories);
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
    const image = await UploadImage(req)
    const { name, count} = req.body || {};
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
    Response(res, 201, "New Category Added");
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
    const { id } = req.params || {};
    if (!id) {
      throw new AppError("Provide What You Want To Delete", 400);
    }
    const cat = await Categories.findOneAndDelete({ _id:id });
    if (!cat) {
      throw new AppError("Category Not Found", 404);
    }
    Response(res, 201, "Category Deleted Successfuly");
  } catch (err) {
    next(err);
  }
};
