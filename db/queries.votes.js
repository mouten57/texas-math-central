const mongoose = require('mongoose');
const Vote = mongoose.model('votes');

module.exports = {
  createVote(req, val, callback) {
    return Vote.findOne({
      resource_id: req.params.resourceId,
      _user: req.user.id
    }).then(vote => {
      if (vote) {
        vote.value = val;
        vote
          .save()
          .then(vote => {
            req.flash('notice', 'New vote recorded.');
            callback(null, vote);
          })
          .catch(err => {
            callback(err);
          });
      } else {
        console.log('line 13');
        var vote = new Vote({
          value: val,
          resource_id: req.params.resourceId,
          _user: req.user.id
        });
        vote.save(err => {
          if (err) return console.log(err);
          console.log(vote);
          callback(null, vote);
        });
      }
    });
  }
};
