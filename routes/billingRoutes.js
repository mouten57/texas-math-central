const requireLogin = require("../middlewares/requireLogin");
const billingController = require("../controllers/billingController");

module.exports = (app) => {
  //charge
  app.post("/api/stripe", requireLogin, billingController.charge);
  app.post(
    "/api/stripe/postcharge",
    requireLogin,
    billingController.postcharge
  );
};
