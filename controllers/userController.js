const userQueries = require("../db/queries.users.js");
const { validationResult } = require("express-validator");
const passport = require("passport");

module.exports = {
  create(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    const { firstname, lastname, email, password, password_confirm } = req.body;
    let newUser = {
      firstname,
      lastname: lastname.toLowerCase(),
      email: email.toLowerCase(),
      password,
      password_confirm,
    };
    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        res.status(400).send({ msg: err });
      } else {
        passport.authenticate("local")(req, res, () => {
          res.send(user);
        });
      }
    });
  },
  signIn(req, res, next) {
    passport.authenticate("local")(req, res, function () {
      if (!req.user) {
        res.status(400).send({ msg: err });
      } else {
        res.send(req.user);
      }
    });
  },
  show(req, res, next) {
    userQueries.getUser(req.user, (err, user) => {
      if (err) {
        res.send(err);
      } else {
        res.send(user);
      }
    });
  },
};
