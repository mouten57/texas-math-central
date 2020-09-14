const userController = require("../controllers/userController");
const { body } = require("express-validator");

module.exports = (app) => {
  app.post(
    "/api/sign_up",
    [
      body("firstname")
        .isLength({ min: 2 })
        .withMessage("must be at least 2 chars long"),
      body("lastname")
        .isLength({ min: 2 })
        .withMessage("must be at least 2 chars long"),
      body("email").isEmail().withMessage("must be an email"),
      body("password")
        .isLength({ min: 5 })
        .withMessage("must be at least 5 chars long"),
      body("password_confirm").custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("does not match password");
        }
        return true;
      }),
    ],
    userController.create
  );
  app.get("/api/profile", userController.show);
};
