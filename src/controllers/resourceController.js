const resourceQueries = require('../db/queries.resources');

module.exports = {
  index(req, res, next) {
    resourceQueries.getAllResources((err, resources) => {
      if (err) {
        res.status(422).send(err);
      } else {
        res.send(resources);
      }
    });
  }
};
