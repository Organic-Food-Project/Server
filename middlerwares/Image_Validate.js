const file_type = require("file-type");
const AppError = require("../utils/AppError");
const Response = require("./Response");
const ImageValidate = (isProduct) => {
  return async (req, res, next) => {
    try {
      const files = req.files || (req.file ? [req.file] : []);
      if (!files || files.length === 0) {
        return next(new AppError("Make Sure You Provide The Images", 400));
      }
      if (isProduct && (files.length > 4 || files.length <= 0)) {
        return next(new AppError("A Product Needs Atleast 4 images", 400));
      }
      for (const file of files) {
        const type = await file_type.fromBuffer(file.buffer);
        if (!type) {
          return Response(
            res,
            500,
            "Something Went Wrong Finding Your Image Type"
          );
        }
        const { ext, mime } = type;
        if (
          mime.startsWith("image/") &&
          ["png", "jpg", "jpeg", "webp", "svg"].includes(ext)
        ) {
          continue;
        } else {
          console.log(mime, ext);
          return next(new AppError("Only Image File Types are allowed", 400));
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = ImageValidate;
