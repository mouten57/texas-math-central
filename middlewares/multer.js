const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

var maxSize = 5 * 1024 * 1024; //1mb

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    //if i want to use UUID ..I do for AWS because the file name is a key
    const newFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    //const newFilename = `${file.originalname}`;
    //const newFilename = file.orginalname;
    cb(null, newFilename);
  },
});

module.exports = {
  upload: multer({ storage: storage }),
};
