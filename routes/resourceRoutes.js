const requireLogin = require("../middlewares/requireLogin");
const resourceController = require("../controllers/resourceController");
const upload = require("../middlewares/multer").upload;
const processImage = require("../middlewares/processImage");

module.exports = (app) => {
  app.get("/api/units/:unit", requireLogin, resourceController.index);
  //handles uploads from uppy file uploader, one at a time
  //removing for now, bc I don't want global.files
  // app.post("/api/upload", upload.single("my_file"), (req, res) => {
  //   if (global.files == undefined || global.createController == "started") {
  //     global.files = [];
  //   }
  //   global.files = [...global.files, req.file];

  //   res.status(200).send("success");
  // });

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
  app.post("/api/units/:unit/:resourceId/delete", resourceController.destroy);

  app.get(
    "/api/units/:unit/:resourceId/download/:filename",
    requireLogin,
    resourceController.download
  );
};
