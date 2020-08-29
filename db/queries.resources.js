const mongoose = require("mongoose");
const Resource = mongoose.model("resources");
const Comment = mongoose.model("comments");
const fs = require("fs");
var AWS = require("aws-sdk");
var keys = require("../config/keys/keys");

var s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

module.exports = {
  getUnitResources(unit, callback) {
    return Resource.find({ unit: unit }, { file_data: 0 }).then((resources) => {
      callback(null, resources);
    });
  },
  addResource(newResource, callback) {
    new Resource(newResource)
      .save()
      .then((resource) => {
        callback(null, resource);
      })
      .catch((err) => callback(err));
  },
  async getResource(_id, callback) {
    let result = {};
    const resource = await Resource.findOne({ _id });
    resource.populate("_user");
    result["resource"] = resource;
    const comments = await Comment.find({ resource_id: _id });
    result["comments"] = comments;
    callback(null, result);
  },
  async destroyResource(_id, callback) {
    const resource = await Resource.findOne({ _id });
    if (resource.s3Object) {
      let s3Object = resource.s3Object;

      s3.deleteObject({ Bucket: s3Object.Bucket, Key: s3Object.Key }, function (
        err,
        data
      ) {
        if (err) console.log(err, err.stack);
        // an error occurred
        else console.log(data); // successful response
      });
    }
    return Resource.deleteOne({ _id })
      .then((resource) => {
        callback(null, resource);
      })
      .catch((err) => {
        callback(err);
      });
  },
};
