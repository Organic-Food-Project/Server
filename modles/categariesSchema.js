const mongoose = require("mongoose");
const product = require("./porductSchema");
const CategoriesSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    default: [],
  },
  image: { type: String, required: true },
  count: { type: Number, default: 0 },
});

const Categories = mongoose.model("catogary", CategoriesSchema);

module.exports = Categories;
