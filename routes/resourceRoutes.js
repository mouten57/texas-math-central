const requireLogin = require("../middlewares/requireLogin");
const resourceController = require("../controllers/resourceController");
const upload = require("../middlewares/multer").upload;
const processImage = require("../middlewares/processImage");
const mongoose = require("mongoose");
const Resource = mongoose.model("resources");
const fs = require("fs");

module.exports = (app) => {
  app.get("/api/units/:unit", requireLogin, resourceController.index);

  app.get("/api/units/:unit/:id", requireLogin, resourceController.show);

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
