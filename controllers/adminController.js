const adminQueries = require("../db/queries.admin");
module.exports = {
  index(req, res) {
    if (req.user.role == "admin") {
      adminQueries.getAll(req.user, (err, result) => {
        if (err) {
          res.status(422).send(err);
        } else {
          res.send(result);
        }
      });
    } else {
      res.send("Not authorized");
    }
  },
};
