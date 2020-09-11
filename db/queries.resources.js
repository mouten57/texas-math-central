const mongoose = require("mongoose");
const Resource = mongoose.model("Resource");
const User = mongoose.model("User");
var AWS = require("aws-sdk");
var keys = require("../config/keys/keys");
const http = require("http");
const fs = require("fs");
var FilePreviews = require("filepreviews");

var s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

module.exports = {
  async getAllResources(req, callback) {
    let resources = await Resource.find({})
      .sort({ created_at: "desc" })
      .populate("_user")
      .populate("favorites")
      .populate("votes")
      .populate({ path: "comments", populate: { path: "_user" } });

    try {
      callback(null, resources);
    } catch (err) {
      callback(err);
    }
  },
  async getUnitResources(unit, callback) {
    let resources = await Resource.find({ unit: unit }, "-files.file_data")
      .sort({ created_at: "desc" })
      .populate("_user")
      .populate("favorites")
      .populate("votes")
      .populate({ path: "comments", populate: { path: "_user" } });
    try {
      callback(null, resources);
    } catch (err) {
      callback(err);
    }
  },
  async addResource(newResource, callback) {
    let resource = await Resource.create(newResource);
    let user = await User.findById(newResource._user);
    user.resources = [...user.resources, resource._id];

    try {
      await user.save();
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
      .populate({ path: "comments", populate: { path: "_user" } });
    try {
      callback(null, resource);
      // }
    } catch (err) {
      callback(err);
    }
  },
  async updateResource(_id, updatedResource, callback) {
    //console.log(updatedResource);
    const resource = await Resource.findOneAndUpdate({ _id }, updatedResource, {
      new: true,
    })
      .populate("_user")
      .populate("favorites")
      .populate("votes")
      .populate({ path: "comments", populate: { path: "_user" } });
    // console.log(resource);
    try {
      callback(null, resource);
    } catch (err) {
      callback(err);
    }
  },
  async updateResourceWithFiles(_id, files, callback) {
    let resource = await Resource.findOneAndUpdate(
      { _id },
      { files },
      { new: true }
    )
      .populate("_user")
      .populate("favorites")
      .populate("votes")
      .populate({ path: "comments", populate: { path: "_user" } });

    try {
      callback(null, resource);
    } catch (err) {
      callback(err);
    }
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
