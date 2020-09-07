const cartQueries = require("../db/queries.carts");
module.exports = {
  index(req, res) {
    if (req.user) {
      cartQueries.getCart(req.user._id, (err, cart) => {
        if (err) {
          res.status(422).send(err);
        } else {
          res.send(cart);
        }
      });
    } else {
      res.send("No user logged in");
    }
  },
  addToCart(req, res) {
    cartQueries.addToCart(req.user._id, req.params.resourceId, (err, cart) => {
      if (err) {
        res.status(422).send(err);
      } else {
        res.send(cart);
      }
    });
  },
  removeFromCart(req, res) {
    cartQueries.removeFromCart(
      req.user._id,
      req.params.resourceId,
      (err, cart) => {
        if (err) {
          res.status(422).send(err);
        } else {
          res.send(cart);
        }
      }
    );
  },
};
