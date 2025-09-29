const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1000 * 1000, files: 4 },
});
const type = async () => {
    
}
module.exports = upload;
