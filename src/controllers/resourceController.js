const resourceQueries = require('../db/queries.resources');
const fs = require('fs');
const mongoose = require('mongoose');
const Resource = mongoose.model('resources');

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
      console.log(resource);
      if (err) {
        res.status(422).send(err);
      } else {
        res.send(resource);
      }
    });
  },

  create(req, res) {
    resourceQueries.createResource(req, (err, reqFile) => {
      console.log(req.file);
      res.send(reqFile);
    });
  }
};
