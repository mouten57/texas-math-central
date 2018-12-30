const commentQueries = require('../db/queries.comments');

module.exports = {
  create(req, res) {
    const comment = {
      resource_id: req.params.resourceId,
      posted: Date.now(), //add in date helper function here
      _user: req.user,
      body: req.body.body
    };
    commentQueries.createComment(comment, (err, result) => {
      if (err) {
        res.send(err);
      }
      comment = wiki['comment'];
      res.send(comment);
    });
  },

  showResourceComments(req, res, next) {
    commentQueries.getResourceComments(req, (err, comments) => {
      if (err) {
        res.send(err);
      } else {
        res.send(comments);
      }
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
