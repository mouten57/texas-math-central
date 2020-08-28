const userController = require("../controllers/userController");

module.exports = (app) => {
  app.get("/api/profile", userController.show);
};
