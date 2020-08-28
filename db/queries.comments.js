const mongoose = require("mongoose");
const Comment = mongoose.model("comments");
const Resource = mongoose.model("resources");

module.exports = {
  async createComment(newComment, callback) {
    const comment = await Comment.create({
      ...newComment,
    });

    try {
      await comment.save();
      callback(null, comment);
    } catch (err) {
      callback(err);
    }
  },

  getResourceComments(req, callback) {
    return (
      Comment.find({ resource_id: req.params.resourceId })
        .then((comments) => callback(null, comments))
        // return Resource.findOne({ _id: req.params.resourceId }, { comments: true })
        //   .then(comments => {
        //     callback(null, comments);
        //   })
        .catch((err) => {
          callback(err);
        })
    );
  },
  getUserComments(_user, callback) {
    Comment.find({ _user })
      .then((comments) => {
        callback(null, comments);
      })
      .catch((err) => callback(err));
  },

  deleteComment(_id, callback) {
    return Comment.deleteOne({ _id })
      .then((response) => {
        callback(null, response);
      })
      .catch((err) => {
        callback(err);
      });
  },
};
