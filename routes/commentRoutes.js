const commentController = require("../controllers/commentController");

module.exports = (app) => {
  app.post(
    "/api/resources/:resourceId/comments/create",
    commentController.create
  );

  app.post(
    "/api/resources/:resourceId/comments/:id/destroy",
    commentController.destroy
  );

  app.get(
    "/api/resources/:resourceId/comments",
    commentController.showResourceComments
  );

  app.get("/api/comments", commentController.showUserComments);
};
