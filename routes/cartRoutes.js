const requireLogin = require("../middlewares/requireLogin");

var cartController = require("../controllers/cartController");
module.exports = (app) => {
  app.get("/api/cart", requireLogin, cartController.index);
  app.post("/api/cart/:resourceId/add", requireLogin, cartController.addToCart);
  app.post(
    "/api/cart/:resourceId/remove",
    requireLogin,
    cartController.removeFromCart
  );
};
