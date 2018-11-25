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
  },

  show(req, res, next) {
    resourceQueries.getResource(req.params.id, (err, resource) => {
      if (err) {
        res.status(422).send(err);
      } else {
        res.send(resource);
      }
    });
  },

  create(req, res) {
    resourceQueries.createResource(req, (err, reqFile) => {
      res.send(reqFile);
    });
  }
};
