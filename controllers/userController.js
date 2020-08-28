const userQueries = require("../db/queries.users.js");

module.exports = {
  show(req, res, next) {
    userQueries.getUser(req.user, (err, result) => {
      if (err || result.user === undefined) {
        req.flash("notice", "No user found with that ID.");
        res.redirect("/");
      } else {
        result = { ...result };
        res.send(result);
      }
    });
  },
};
