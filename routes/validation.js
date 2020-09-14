//functions like checkBody come from express-validator. How to send error to react?
const { body } = require("express-validator");

module.exports = {
  validateUsers(req, res, next) {
    if (req.method === "POST") {
      console.log(req.body);
      body("password_confirm").custom((value, { req }) => {
        if (value != req.body.password) {
          console.log("tests");
          throw new Error("Password confirmation does not match password");
        } else {
          console.log("test2");
          return next();
        }
      });
    }
    return next();
  },
};
