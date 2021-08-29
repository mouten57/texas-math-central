const mongoose = require("mongoose");
const Resource = mongoose.model("Resource");
const User = mongoose.model("User");

module.exports = {
  async getAll(user, callback) {
    let result = {};
    let users = await User.find({})
      .populate("resources")
      .populate("purchasedResources")
      .populate({ path: "comments", populate: "resource_id" });
    result.users = users;
    try {
      callback(null, result);
    } catch (err) {
      callback(err);
    }
  },
};
