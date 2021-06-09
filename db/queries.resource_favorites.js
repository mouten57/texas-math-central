const mongoose = require("mongoose");
const ResourceFavorites = mongoose.model("ResourceFavorites");

module.exports = {
  async increaseFavoriteCount(resourceId, callback) {
    const resourceFavoriteCount = await ResourceFavorites.findOne({
      resource_id: resourceId,
      viewed_on: current_viewed_on,
    });
    if (resourceFavoriteCount) {
      try {
        resourceFavoriteCount.favorite_count++;
        resourceFavoriteCount.save();
        callback(null, resourceFavoriteCount);
      } catch (err) {
        callback(err);
      }
    } else {
      let newResourceFavoriteCount = {
        resource_id: resourceId,
        viewed_on: current_viewed_on,
        favorite_count: 1,
      };
      try {
        var createdCount = await ResourceFavorites.create(
          newResourceFavoriteCount
        );
        callback(null, createdCount);
      } catch (err) {
        callback(err);
      }
    }
  },
};
