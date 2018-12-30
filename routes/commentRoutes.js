const commentController = require('../controllers/commentController');
const mongoose = require('mongoose');
const Comment = mongoose.model('comments');
const convertTimeStamp = require('../helpers/convertTimestamp');

module.exports = app => {
  app.post('/api/resources/:resourceId/comments/create', async (req, res) => {
    const comment = await Comment.create({
      resource_id: req.params.resourceId,
      posted: convertTimeStamp(Date.now()),
      _user: req.user,
      body: req.body.body
    });

    try {
      await comment.save();

      res.send(comment);
    } catch (err) {
      res.status(422).send(err);
    }
  });

  app.post(
    '/api/resources/:resourceId/comments/:id/destroy',
    commentController.destroy
  );

  app.get(
    '/api/resources/:resourceId/comments',
    commentController.showResourceComments
  );

  app.get('/api/comments', (req, res) => {
    return Comment.find({ _user: req.user }).then(comments =>
      res.send(comments)
    );
  });
};
