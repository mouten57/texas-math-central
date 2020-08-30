const mongoose = require("mongoose");
const Vote = mongoose.model("Vote");

module.exports = {
  createVote(req, val, callback) {
    return Vote.findOne({
      resource_id: req.params.resourceId,
      _user: req.user.id,
    }).then((vote) => {
      if (vote) {
        vote.value = val;
        vote
          .save()
          .then((vote) => {
            req.flash("notice", "New vote recorded.");
            callback(null, vote);
          })
          .catch((err) => {
            callback(err);
          });
      } else {
        var vote = new Vote({
          value: val,
          resource_id: req.params.resourceId,
          _user: req.user.id,
        });
        vote.save((err) => {
          if (err) return console.log(err);

          callback(null, vote);
        });
      }
    });
  },
  getVotes(resource_id, callback) {
    return Vote.find({ resource_id })
      .then((votes) => {
        callback(null, votes);
      })
      .catch((err) => callback(err));
  },
};
