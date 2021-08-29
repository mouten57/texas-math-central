const sharp = require("sharp");
const fs = require("fs");

module.exports = (req, res, next) => {
  if (req.file === undefined) {
    next();
  } else if (req.file !== "") {
    let images = [req.file.path];
    let promises = [];

    new Promise((resolve, reject) => {
      sharp(req.file.path)
        .resize({ height: 400 })
        .toFile(`uploads/sharp_${req.file.filename}`, (err) => {
          if (err) throw err;
          resolve();
        });
    });

    Promise.all(promises).then(() => next());
  }
};
