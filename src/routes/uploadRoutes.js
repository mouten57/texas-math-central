const multer = require('multer');
const uuidv4 = require('uuid/v4');
const path = require('path');
const mongoose = require('mongoose');
const Resource = mongoose.model('resources');
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
    console.log(req.body);
    res.send(req.file);

    const upload = new Resource({
      name: req.body.name,
      unit: req.body.unit,
      type: req.body.type,
      link: req.body.link,
      description: req.body.description,
      _user: req.user.id,
      dateSent: Date.now(),
      file_name: req.file.originalname,
      file_type: req.file.mimetype,
      file_path: req.file.path,
      file_data: fs.readFileSync(req.file.path)
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
