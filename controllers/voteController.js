const voteQueries = require('../db/queries.votes.js');

module.exports = {
  upvote(req, res, next) {
    if (req.user) {
      voteQueries.createVote(req, 1, (err, vote) => {
        if (err) {
          console.log(err);
        }

        res.send(vote);
      });
    } else {
      res.redirect(req.headers.referer);
    }
  },
  downvote(req, res, next) {
    if (req.user) {
      voteQueries.createVote(req, -1, (err, vote) => {
        if (err) {
          console.log(err);
        }
        res.send(vote);
      });
    } else {
      res.send('You must be signed in to do that.');
    }
  }
};
