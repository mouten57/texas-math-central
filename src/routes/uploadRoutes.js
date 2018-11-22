const multer = require('multer');
const uuidv4 = require('uuid/v4');
const path = require('path');
const mongoose = require('mongoose');
const Upload = mongoose.model('uploads');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/uploads');
  },
  filename: (req, file, cb) => {
    const newFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  }
});

var fileFilter = function(req, file, cb) {
  if (file.mimetype !== 'image/jpeg') {
    req.fileValidationError = 'goes wrong on the mimetype';
    return cb(
      new Error('mimetype does not match application/zip. upload rejected')
    );
  }
  console.log('>> fileFilter good = ', file.mimetype);
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = app => {
  app.post('/api/upload', upload.single('selectedFile'), (req, res) => {
    console.log(req.file);
    res.send(req.file);

    const upload = new Upload({
      name: req.file.originalname,
      type: 'image/png',
      path: req.file.path,
      data: fs.readFileSync(req.file.path)
    });
    upload
      .save()

      .then(() => {
        console.log(`${upload.name} saved to collection.`);
      })
      .then(() => {
        fs.unlink(`./src/uploads/${req.file.filename}`, err => {
          if (err) {
            console.log('Failed to delete local image:' + err);
          } else {
            console.log(
              `Successfully deleted ${upload.name} from local storage.`
            );
          }
        });
      });
  });
};
