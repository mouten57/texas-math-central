const keys = require("../config/keys/keys");
const stripe = require("stripe")(keys.stripeSecretKey);
const requireLogin = require("../middlewares/requireLogin");

module.exports = (app) => {
  //charge
  app.post("/api/stripe", requireLogin, async (req, res) => {
    console.log(typeof req.body.amount);
    const { amount } = req.body;
    const intent = await stripe.paymentIntents.create({
      //amount is in pennies
      amount: amount * 100,
      currency: "usd",
    });
    res.json({ client_secret: intent.client_secret });
  });
};
