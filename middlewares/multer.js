const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

var maxSize = 5 * 1024 * 1024; //1mb

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const newFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  },
});

module.exports = {
  upload: multer({ storage: storage }),
};
