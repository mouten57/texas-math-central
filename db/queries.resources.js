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
  async getResource(_id, callback) {
    //if files exist, loop through files to see if previewLink on each is populated
    // if not, i need to check the FilePreview, using the resource.files[index].previewID
    //can use this:
    // previews.retrieve(resource.files[0].previewID, function (err, result) {
    //  console.log(result);
    // });
    //I need to download the file locally, upload it to aws, and then set a new field called 'previewLink' for each file
    //if file.mimetype is not image, we need to fetch the data, if it is image, we can just set the previewLink to "Not needed for image"

    //probably should do all of this in the queries file so I can save changes
    //probably should move aws stuff from controller in here too

    const resource = await Resource.findOne({ _id }, "-files.file_data")
      .populate("_user")
      .populate("favorites")
      .populate("votes")
      .populate({ path: "comments", populate: { path: "_user" } });
    try {
      // if (resource.files.length > 0) {
      //   // let files = resource.files;
      //   // for (let i in files) {
      //   //   // previews.retrieve(resource.files[0].previewID, function (err, result) {
      //   //   //  console.log(result);
      //   //   // });
      //   //   let previewLink = files[i].previewLink;
      //   //   console.log(files[i]);
      //   //}
      //   callback(null, resource);
      // } else {
      callback(null, resource);
      // }
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
