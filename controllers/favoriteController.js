const favoriteQueries = require("../db/queries.favorites.js");

module.exports = {
  create(req, res, next) {
    // if (req.user) {
    let newFavorite = {
      resource_id: req.params.resourceId,
      created_at: Date.now(),
      _user: req.user[0],
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
    if (req.user) {
      favoriteQueries.deleteFavorite(req, (err, deletedRecordsCount) => {
        if (err) {
          req.flash("error", err);
        }
        res.redirect(req.headers.referer);
      });
    } else {
      req.flash("notice", "You must be signed in to do that.");
      res.redirect(req.headers.referer);
    }
  },
};
