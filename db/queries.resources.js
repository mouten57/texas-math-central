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
  createResource(req, callback) {
    if (req.body.imageFile === "") {
      const resource = new Resource({
        name: req.body.name,
        unit: req.body.unit,
        type: req.body.type,
        link: req.body.link,
        description: req.body.description,
        _user: req.user, //saves entire user profile so we can access name, nickname, photo easily on comment form
        created: Date.now(),
      });
      resource.save().catch((err) => callback(err));
    } else {
      const resource = new Resource({
        name: req.body.name,
        unit: req.body.unit,
        type: req.body.type,
        link: req.body.link,
        description: req.body.description,
        _user: req.user, //see above comment
        dateSent: Date.now(),
        file_name: req.file.originalname,
        file_type: req.file.mimetype,
        file_path: req.file.path,
        file_data: fs.readFileSync("./src/uploads/output.jpg"),
      });

      resource
        .save()
        .then(() => {
          console.log(`${resource.name} saved to collection.`);
        })
        .then(() => {
          fs.unlink(`./src/uploads/${req.file.filename}`, (err) => {
            if (err) {
              console.log("Failed to delete local image:" + err);
            } else {
              console.log(
                `Successfully deleted ${resource.name} from local storage.`
              );
            }
          });
        })
        .then(() => {
          fs.unlink(`./src/uploads/output.jpg`, (err) => {
            if (err) {
              console.log("Failed to delete local image:" + err);
            } else {
              console.log(
                `Successfully deleted output.jpg from local storage.`
              );
            }
          });
        })
        .catch((err) => callback(err));
    }
    callback(null, req.file);
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
