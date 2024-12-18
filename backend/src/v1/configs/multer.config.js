const multer = require("multer");

const uploadMemory = multer({
  storage: multer.memoryStorage(),
});

const uploadDisk = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./src/v1/uploads");
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

module.exports = {
  uploadMemory,
  uploadDisk,
};
