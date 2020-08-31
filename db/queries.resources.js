const mongoose = require("mongoose");
const Resource = mongoose.model("Resource");
const Comment = mongoose.model("Comment");
const User = mongoose.model("User");
const Vote = mongoose.model("Vote");
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
    const resource = await Resource.findOne({ _id })
      .populate("_user")
      .populate("favorites")
      .populate("votes")
      .populate("comments");

    // result["resource"] = resource;
    // console.log(result);
    // const comments = await Comment.find({ resource_id: _id }).populate("_user");
    // result["comments"] = comments;
    callback(null, resource);
  },
  async destroyResource(req, callback) {
    let _id = req.params.resourceId;
    let resource = await Resource.deleteOne({ _id });
    let comment = await Comment.deleteMany({ resource_id: _id });
    let vote = await Vote.deleteMany({ resource_id: _id });
    let user = await User.findOne({ _id: req.user._id });
    let temp = user.resources;
    let idx = user.resources.indexOf(_id);
    temp.splice(idx, 1);
    user.resources = temp;
    try {
      user.save();
      callback(null, user);
    } catch (err) {
      callback(err);
    }
  },
};
