const requireLogin = require("../middlewares/requireLogin");
var adminController = require("../controllers/adminController");

module.exports = (app) => {
  app.get("/api/admin", adminController.index);
};
