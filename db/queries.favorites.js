const mongoose = require("mongoose");
const Favorite = mongoose.model("Favorite");
const User = mongoose.model("User");
const Resource = mongoose.model("Resource");

module.exports = {
  async createFavorite(newFavorite, callback) {
    const favorite = await Favorite.create({
      ...newFavorite,
    });
    let user = await User.findById(newFavorite._user);
    user.favorites = [...user.favorites, favorite._id];
    let resource = await Resource.findById(newFavorite.resource_id);
    resource.favorites = [...resource.favorites, favorite._id];
    try {
      await resource.save();
      await user.save();
      await favorite.save();
      callback(null, favorite);
    } catch (err) {
      callback(err);
    }
  },
  getFavorites(resource_id, callback) {
    return Favorite.find({ resource_id })
      .then((favorites) => {
        callback(null, favorites);
      })
      .catch((err) => callback(err));
  },
  async deleteFavorite(req, callback) {
    const _id = req.params.id;
    let deletedCount = await Favorite.deleteOne({ _id });
    try {
      callback(null, deletedCount);
    } catch (err) {
      callback(err);
    }
  },
};
