const mongoose = require("mongoose");
const User = mongoose.model("User");
const Resource = mongoose.model("Resource");
const Comment = mongoose.model("Comment");

module.exports = {
  getAllUsers(callback) {
    return User.find({})
      .then((users) => {
        callback(null, users);
      })
      .catch((err) => {
        callback(err);
      });
  },

  getUser(user, callback) {
    let result = {};
    User.findOne({ _id: user._id }).then((user) => {
      if (!user) {
        callback(404);
      } else {
        result["user"] = user;

        Resource.find({ _user: user }).then((resources) => {
          result["resources"] = resources;
          Comment.find({ _user: user }).then((comments) => {
            result["comments"] = comments;
            callback(null, result);
          });
        });
      }
    });
  },
};
