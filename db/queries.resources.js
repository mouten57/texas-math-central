const mongoose = require("mongoose");
const { google } = require("googleapis");
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
  async getUnitResources(unit, queries, callback) {
    let search = { unit };
    if (queries.name) {
      search.name = new RegExp(queries.name, "i");
    }
    if (queries.type) {
      search.type = new RegExp(queries.type, "i");
    }
    if (queries.grade) {
      search.grade = new RegExp(queries.grade, "i");
    }

    let resources = await Resource.find(search)
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
    updatedResource.updated_at = new Date();
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
  async increaseViewCount(_id, callback) {
    let resource = await Resource.findOne({ _id });
    if (resource) {
      console.log(resource);
      let currentCount = resource.views;
      resource.views = resource.views ? currentCount + 1 : 1;
      try {
        resource.save();
        callback(null, resource);
      } catch (err) {
        callback(err);
      }
    } else {
      callback("NO FILE");
    }
  },
  async getMostPopularResources(req, callback) {
    //big aggregation to sort by most favorited in last 5 days
    Resource.aggregate([
      {
        $match: {
          updated_at: {
            $gte: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $project: {
          _id: true,
          name: true,
          created_at: true,
          favorites: true,
          files: true,
          votes: true,
          updated_at: true,
          numberOfFavorites: {
            $size: "$favorites",
          },
        },
      },
      {
        $match: {
          numberOfFavorites: { $gt: 0 },
        },
      },
      {
        $sort: {
          numberOfFavorites: -1,
          updated_at: -1,
        },
      },
    ]);
  },
};
