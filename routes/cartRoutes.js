var cartController = require("../controllers/cartController");
module.exports = (app) => {
  app.get("/api/cart", cartController.index);
  app.post("/api/cart/:resourceId/add", cartController.addToCart);
  app.post("/api/cart/:resourceId/remove", cartController.removeFromCart);
};
