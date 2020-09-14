const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = mongoose.model("User");
const Resource = mongoose.model("Resource");
const Comment = mongoose.model("Comment");
const Favorite = mongoose.model("Favorite");

module.exports = {
  async createUser(newUser, callback) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    const { firstname, lastname, email } = newUser;
    const user = await User.findOne({ email });
    if (user) {
      const err = "Email has already been used.";
      callback(err);
    } else {
      const newUserToCreate = await User.create({
        firstname,
        lastname,
        name: `${firstname} ${lastname}`,
        email,
        password: hashedPassword,
      });

      try {
        callback(null, newUserToCreate);
      } catch (err) {
        callback(err);
      }
    }
  },
  getAllUsers(callback) {
    return User.find({})
      .then((users) => {
        callback(null, users);
      })
      .catch((err) => {
        callback(err);
      });
  },
  // .sort({ created_at: "desc" })
  // .populate("_user")
  // .populate("favorites")
  // .populate("votes")
  // .populate({ path: "comments", populate: { path: "_user" } });

  async getUser(_user, callback) {
    let user = await User.findOne({ _id: _user._id }).populate(
      "purchasedResources"
    );

    let comments = await Comment.find({ _user: _user.id }).populate(
      "resource_id"
    );

    let resources = await Resource.find({ _user: _user.id })
      .sort({ created_at: "desc" })
      .populate("_user")
      .populate("favorites")
      .populate("votes")
      .populate({ path: "comments", populate: { path: "_user" } });

    let favorites = await Favorite.find({ _user: _user.id }).populate({
      path: "resource_id",
      select: "-files.file_data",
    });

    let data = { user, comments, resources, favorites };

    try {
      callback(null, data);
    } catch (err) {
      callback(err);
    }
  },
};
