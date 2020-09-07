const billingQueries = require("../db/queries.billing");
const keys = require("../config/keys/keys");
const stripe = require("stripe")(keys.stripeSecretKey);

module.exports = {
  async charge(req, res) {
    console.log(typeof req.body.amount);
    const { amount } = req.body;
    const intent = await stripe.paymentIntents.create({
      //amount is in pennies
      amount: amount * 100,
      currency: "usd",
    });
    res.json({ client_secret: intent.client_secret });
  },
  postcharge(req, res) {
    billingQueries.postcharge(
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
