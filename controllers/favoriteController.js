const favoriteQueries = require("../db/queries.favorites.js");

module.exports = {
  create(req, res, next) {
    // if (req.user) {
    let newFavorite = {
      resource_id: req.params.resourceId,
      created_at: Date.now(),
      _user: req.user._id,
    };
    favoriteQueries.createFavorite(newFavorite, (err, favorite) => {
      if (err) {
        res.send(error);
      }
      res.send(favorite);
    });
    // } else {
    //   req.flash("notice", "You must be signed in to do that.");
    // }
  },
  destroy(req, res, next) {
    favoriteQueries.deleteFavorite(req, (err, deletedRecordsCount) => {
      if (err) {
        res.send(err);
      }
      res.send(deletedRecordsCount);
    });
  },
};
