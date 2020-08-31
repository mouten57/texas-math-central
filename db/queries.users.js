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

  async getUser(_user, callback) {
    let user = await User.findOne({ _id: _user._id })
      .populate("resources")
      .populate("comments")
      .populate({
        path: "favorites",
        populate: {
          path: "resource_id",
        },
      });

    try {
      callback(null, user);
    } catch (err) {
      callback(err);
    }
  },
};
