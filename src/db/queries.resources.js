const mongoose = require('mongoose');
const Resource = mongoose.model('resources');

module.exports = {
  getAllResources(callback) {
    return Resource.find({}).then(resources => {
      callback(null, resources);
    });
  },
  addResource(newResource, callback) {
    return;
  },
  getResource(id, callback) {
    return Resource.find({ _id: id })
      .then(resource => {
        callback(null, resource);
      })
      .catch(err => {
        callback(err);
      });
  }
};
