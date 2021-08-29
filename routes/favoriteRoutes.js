const favoriteController = require("../controllers/favoriteController");

module.exports = (app) => {
  app.post(
    "/api/resources/:resourceId/favorites/create",
    favoriteController.create
  );
  app.post(
    "/api/resources/:resourceId/favorites/:id/destroy",
    favoriteController.destroy
  );
};
