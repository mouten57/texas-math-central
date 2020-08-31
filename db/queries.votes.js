const mongoose = require("mongoose");
const Vote = mongoose.model("Vote");
const Resource = mongoose.model("Resource");

module.exports = {
  async createVote(req, val, callback) {
    let vote = await Vote.findOne({
      resource_id: req.params.resourceId,
      _user: req.user.id,
    });
    if (vote) {
      vote.value = val;
      let resource = await Resource.findOne({ _id: vote.resource_id });
      resource.votes = [...resource.votes, vote];
      try {
        vote.save();
        callback(null, vote);
      } catch (err) {
        callback(err);
      }
    } else {
      let vote = await Vote.create({
        value: val,
        resource_id: req.params.resourceId,
        _user: req.user.id,
      });
      let resource = await Resource.findOne({ _id: vote.resource_id });
      resource.votes = [...resource.votes, vote];
      try {
        vote.save();
        resource.save();
        callback(null, vote);
      } catch (err) {
        callback(err);
      }
    }
  },
  async getVotes(resource_id, callback) {
    let votes = await Vote.find({ resource_id });

    try {
      callback(null, votes);
    } catch (err) {
      callback(err);
    }
  },
};
