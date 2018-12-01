const commentQueries = require('../db/queries.comments');

module.exports = {
  create(req, res, next) {
    let newComment = {
      body: req.body.body,
      userId: req.user.id,
      resourceId: req.params.resourceId
    };

    commentQueries.createComment(newComment, (err, comment) => {
      if (err) {
        res.status(422).send(err);
      }
      res.send(comments);
    });
  },

  destroy(req, res, next) {
    commentQueries.deleteComment(req, (err, comment) => {
      if (err) {
        res.status(422).send(err);
      } else {
        res.redirect(req.headers.referer);
      }
    });
  }
};
