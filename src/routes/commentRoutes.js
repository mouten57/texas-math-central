const commentController = require('../controllers/commentController');
const mongoose = require('mongoose');
const Comment = mongoose.model('comments');
const Resource = mongoose.model('resources');
const User = mongoose.model('users');

module.exports = app => {
  app.post('/api/resources/:resourceId/comments/create', async (req, res) => {
    const comment = await Comment.create({
      resource_id: req.params.resourceId,
      posted: Date.now(),
      _user: req.user,
      body: req.body.body
    });
    const resource = await Resource.findOneAndUpdate(
      { _id: req.params.resourceId },
      { $push: { comments: comment } },
      { new: true }
    );

    try {
      await resource.save();
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

  app.get('/api/resources/:resourceId/comments', (req, res) => {
    return Resource.findOne(
      { _id: req.params.resourceId },
      { comments: true }
    ).then(comments => res.send(comments));
  });
  app.get('/api/comments', (req, res) => {
    return Comment.find({}).then(comments => res.send(comments));
  });
};
