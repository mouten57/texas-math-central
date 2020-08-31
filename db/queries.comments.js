const mongoose = require("mongoose");
const Comment = mongoose.model("Comment");

module.exports = {
  async createComment(newComment, callback) {
    let comment = await Comment.create({
      ...newComment,
    });
    comment = await comment.populate("_user").execPopulate();
    try {
      callback(null, comment);
    } catch (err) {
      callback(err);
    }
  },

  async getResourceComments(req, callback) {
    let comments = await Comment.find({
      resource_id: req.params.resourceId,
    }).populate("_user");

    try {
      callback(null, comments);
    } catch (err) {
      callback(err);
    }
  },
  getUserComments(_user, callback) {
    Comment.find({ _user })
      .then((comments) => {
        callback(null, comments);
      })
      .catch((err) => callback(err));
  },

  async deleteComment(req, callback) {
    let deletedCount = await Comment.deleteOne({ _id: req.params.id });
    try {
      callback(null, deletedCount);
    } catch (err) {
      callback(err);
    }
  },
};
