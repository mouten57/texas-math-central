const requireLogin = require("../middlewares/requireLogin");
const resourceController = require("../controllers/resourceController");
const multer = require("multer");
const uuidv4 = require("uuidv4");
const path = require("path");
const processImage = require("../middlewares/processImage");
const mongoose = require("mongoose");
const Resource = mongoose.model("resources");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/uploads");
  },
  filename: (req, file, cb) => {
    const newFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  },
});

var fileFilter = function (req, file, cb) {
  if (file.mimetype !== "image/jpeg") {
    req.fileValidationError = "goes wrong on the mimetype";
    return cb(
      new Error("mimetype does not match application/zip. upload rejected")
    );
  }
  console.log(">> fileFilter good = ", file.mimetype);
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = (app) => {
  app.get("/api/resources", requireLogin, resourceController.index);

  app.get("/api/resources/:id", requireLogin, resourceController.show);

  app.post(
    "/api/resources/create",
    requireLogin,
    upload.single("imageFile"),
    processImage,
    resourceController.create
  );

  app.get("/api/resources/:id/download", requireLogin, (req, res) => {
    return Resource.find({ _id: req.params.id }).then((resource) => {
      let buffer = new Buffer(resource[0].file_data.buffer);
      fs.writeFile(resource[0].file_path, buffer, (err) => {
        if (err) throw err;
        console.log("success!!!!!!");
        res.download("./" + resource[0].file_path);
        // fs.unlinkSync(`./${resource[0].file_path}`);
        //need to delete file after download is complete
      });
    });
  });
};
