const mongoose = require("mongoose");
const Vote = mongoose.model("Vote");
const Resource = mongoose.model("Resource");
const User = mongoose.model("User");

module.exports = {
  async createVote(req, val, callback) {
    let vote = await Vote.findOne({
      resource_id: req.params.resourceId,
      _user: req.user._id,
    });

    if (vote) {
      //means this is an update
      vote.value = val;
      vote.updated_at = new Date();
      //I dont think we need to add values to resource and user if votes already exist
      // let resource = await Resource.findOne({ _id: vote.resource_id });
      // let user = await User.findOne({ _id: vote._user });
      // resource.votes = [...resource.votes, vote];
      // user.votes = [...user.votes, vote];
      try {
        // await user.save();
        // await resource.save();
        await vote.save();
        callback(null, vote);
      } catch (err) {
        callback(err);
      }
    } else {
      let vote = await Vote.create({
        value: val,
        resource_id: req.params.resourceId,
        _user: req.user._id,
      });
      let resource = await Resource.findOne({ _id: vote.resource_id });
      let user = await User.findOne({ _id: vote._user });
      resource.votes = [...resource.votes, vote];
      user.votes = [...user.votes, vote];
      try {
        await vote.save();
        await user.save();
        await resource.save();
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
