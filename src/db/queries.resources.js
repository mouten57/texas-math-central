const mongoose = require('mongoose');
const Resource = mongoose.model('resources');

module.exports = {
  getAllResources(callback) {
    return Resource.find({}).then(resources => {
      callback(null, resources);
    });
  }
};
