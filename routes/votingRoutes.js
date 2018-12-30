const voteController = require('../controllers/voteController');
const mongoose = require('mongoose');
const Vote = mongoose.model('votes');

module.exports = app => {
  app.get('/api/resources/:resourceId/votes/upvote', voteController.upvote);

  app.get('/api/resources/:resourceId/votes/downvote', voteController.downvote);

  app.get('/api/resources/:resourceId/votes/total', (req, res) => {
    return Vote.find({ resource_id: req.params.resourceId }).then(votes => {
      if (votes) {
        res.send(votes);
      }
    });
  });
};
