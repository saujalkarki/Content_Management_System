const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const allowedFileType = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];
    const comingFileType = file.mimetype;
    if (!allowedFileType.includes(comingFileType)) {
      cb(new Error("This file type is not allowed"));
    } else {
      cb(null, "./uploads");
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports = {
  multer,
  storage,
};
