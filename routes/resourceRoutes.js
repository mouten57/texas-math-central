const requireLogin = require("../middlewares/requireLogin");
const resourceController = require("../controllers/resourceController");
const upload = require("../middlewares/multer").upload;
const processImage = require("../middlewares/processImage");

module.exports = (app) => {
  app.get("/api/resources", requireLogin, resourceController.index);

  app.get(
    "/api/units/:unit",
    requireLogin,
    resourceController.getUnitResources
  );

  app.get("/api/units/:unit/:id", requireLogin, resourceController.show);

  app.post(
    "/api/resources/create",
    requireLogin,
    //when i removed upload.array(files) (multer), the form data didnt make it to the controller
    //not sure why?
    upload.array("files"),
    // processImage,
    resourceController.create
  );
  app.post(
    "/api/drive/download",
    requireLogin,
    resourceController.getDriveFiles
  );
  app.post("/api/units/:unit/:resourceId/delete", resourceController.destroy);
  app.get("/api/resources/:resourceId/edit", resourceController.edit);
  app.post("/api/resources/:resourceId/update", resourceController.update);
  app.get(
    "/api/units/:unit/:resourceId/download/:filename",
    requireLogin,
    resourceController.download
  );
};
