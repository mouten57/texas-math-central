const requireLogin = require("../middlewares/requireLogin");
const resourceController = require("../controllers/resourceController");
const upload = require("../middlewares/multer").upload;
const processImage = require("../middlewares/processImage");
const mongoose = require("mongoose");
const Resource = mongoose.model("Resource");
const fs = require("fs");

module.exports = (app) => {
  app.get("/api/units/:unit", requireLogin, resourceController.index);

  app.get("/api/units/:unit/:id", requireLogin, resourceController.show);

  app.post(
    "/api/resources/create",
    requireLogin,
    upload.array("files"),
    // processImage,
    resourceController.create
  );
  app.post("/api/units/:unit/:resourceId/delete", resourceController.destroy);

  app.get(
    "/api/units/:unit/:resourceId/download/:filename",
    requireLogin,
    resourceController.download
  );
};
