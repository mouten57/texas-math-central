const sharp = require('sharp');
const fs = require('fs');

module.exports = (req, res, next) => {
  sharp(req.file.path)
    .resize({ height: 250 })
    .toBuffer()
    .then(data => {
      console.log(data);
      let buffer = new Buffer(data);
      fs.writeFile(req.file.path, buffer, err => {
        if (err) throw err;
        console.log('success!!!!!!');
      });
    });

  next();
};
