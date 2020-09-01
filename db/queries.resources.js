const mongoose = require("mongoose");
const Resource = mongoose.model("Resource");
const User = mongoose.model("User");
var AWS = require("aws-sdk");
var keys = require("../config/keys/keys");

var s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

module.exports = {
  getUnitResources(unit, callback) {
    return Resource.find({ unit: unit }, "-files.file_data").then(
      (resources) => {
        callback(null, resources);
      }
    );
  },
  async addResource(newResource, callback) {
    let resource = await Resource.create(newResource);
    let user = await User.findById(newResource._user);
    user.resources = [...user.resources, resource._id];

    try {
      user.save();
      callback(null, resource);
    } catch (err) {
      callback(err);
    }
  },
  async getResource(_id, callback) {
    const resource = await Resource.findOne({ _id }, "-files.file_data")
      .populate("_user")
      .populate("favorites")
      .populate("votes")
      .populate("comments");

    callback(null, resource);
  },
  async downloadResource(_id, callback) {
    const resource = await Resource.findOne({ _id });
    try {
      callback(null, resource);
    } catch (err) {
      callback(err);
    }
  },
  async destroyResource(req, callback) {
    let _id = req.params.resourceId;
    let resource = await Resource.findOne({ _id });
    // moved all cleanup to Resource model. See Resource.js
    try {
      let deleteCount = await resource.deleteOne();
      callback(null, deleteCount);
    } catch (err) {
      callback(err);
    }
  },
};
