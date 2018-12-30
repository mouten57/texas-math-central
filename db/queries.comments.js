const mongoose = require('mongoose');
const Comment = mongoose.model('comments');
const Resource = mongoose.model('resources');

module.exports = {
  createComment(newComment, callback) {
    let result = {};
    return Comment.create({
      resource_id: newComment.resource_id,
      posted: newComment.posted,
      _user: newComment._user,
      body: newComment.body
    })
      .then(comment => {
        result['comment'] = comment;
        Resource.findOneAndUpdate(
          { _id: comment.resource_id },
          { $push: { comments: comment } },
          { new: true }
        );
        callback(null, comment);
      })
      .catch(err => {
        callback(err);
      });
  },

  getResourceComments(req, callback) {
    return (
      Comment.find({ resource_id: req.params.resourceId })
        .then(comments => callback(null, comments))
        // return Resource.findOne({ _id: req.params.resourceId }, { comments: true })
        //   .then(comments => {
        //     callback(null, comments);
        //   })
        .catch(err => {
          callback(err);
        })
    );
  },

  deleteComment(req, callback) {
    return Comment.findById(req.params.id).then(comment => {
      const authorized = new Authorizer(req.user, comment).destroy();

      if (authorized) {
        comment.destroy();
        callback(null, comment);
      } else {
        req.flash('notice', 'You are not authorized to do that.');
        callback(401);
      }
    });
  }
};
