const mongoose = require("mongoose");
const Favorite = mongoose.model("Favorite");
// async createComment(newComment, callback) {
//     const comment = await Comment.create({
//       ...newComment,
//     });

//     try {
//       await comment.save();
//       callback(null, comment);
//     } catch (err) {
//       callback(err);
//     }
//   },
module.exports = {
  async createFavorite(newFavorite, callback) {
    const favorite = await Favorite.create({
      ...newFavorite,
    });
    try {
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
  deleteFavorite(req, callback) {
    const id = req.params.id;
    return Favorite.findById(id)
      .then((favorite) => {
        if (!favorite) {
          return callback("Favorite not found");
        }

        Favorite.destroy({ where: { id } }) // <-- this syntax
          .then((deletedRecordsCount) => {
            // <-- will actually return a value for this
            callback(null, deletedRecordsCount);
          });
      })
      .catch((err) => {
        callback(err);
      });
  },
};
