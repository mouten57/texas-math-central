const userQueries = require("../db/queries.users.js");

module.exports = {
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
