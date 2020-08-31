const mongoose = require("mongoose");
const Comment = mongoose.model("Comment");
const Resource = mongoose.model("Resource");
const User = mongoose.model("User");
module.exports = {
  async createComment(newComment, callback) {
    let comment = await Comment.create({
      ...newComment,
    });
    comment = await comment.populate("_user").execPopulate();

    let resource = await Resource.findOne({ _id: comment.resource_id });
    resource.comments = [...resource.comments, comment];

    let user = await User.findById(comment._user);
    user.comments = [...user.comments, comment];

    try {
      await user.save();
      await resource.save();
      await comment.save();
      callback(null, comment);
    } catch (err) {
      callback(err);
    }
  },

  getResourceComments(req, callback) {
    return (
      Comment.find({ resource_id: req.params.resourceId })
        .populate("_user")
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

  async deleteComment(req, callback) {
    let deletedCount = await Comment.deleteOne({ _id: req.params.id });
    try {
      callback(null, deletedCount);
    } catch (err) {
      callback(err);
    }
  },
};
