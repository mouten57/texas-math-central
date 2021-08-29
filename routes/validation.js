//functions like checkBody come from express-validator. How to send error to react?
const { body } = require("express-validator");

module.exports = {
  validateUsers(req, res, next) {
    if (req.method === "POST") {
      body("password_confirm").custom((value, { req }) => {
        if (value != req.body.password) {
          throw new Error("Password confirmation does not match password");
        } else {
          return next();
        }
      });
    }
    return next();
  },
};
