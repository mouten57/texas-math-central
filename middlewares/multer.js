const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

var maxSize = 5 * 1024 * 1024; //1mb

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/uploads");
  },
  filename: (req, file, cb) => {
    const newFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  },
});

// var fileFilter = function(req, file, cb) {
//   if (file.mimetype !== 'image/jpeg') {
//     req.fileValidationError = 'goes wrong on the mimetype';
//     return cb(
//       new Error('mimetype does not match application/zip. upload rejected')
//     );
//   }
//   console.log('>> fileFilter good = ', file.mimetype);
//   cb(null, true);
// };

module.exports = {
  upload: multer({
    storage: storage,
    limits: { fileSize: maxSize },
  }),
};
