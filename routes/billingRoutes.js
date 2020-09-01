const keys = require("../config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);
const requireLogin = require("../middlewares/requireLogin");

module.exports = (app) => {
  //charge
  app.post("/api/stripe", requireLogin, async (req, res) => {
    const charge = await stripe.charges.create({
      amount: 500,
      currency: "usd",
      description: "$5 for 5 credits",
      source: req.body.id,
    });
    //update DB using the passport req.user
    //what if there is no req.user? (no one logged in) - it should be caught by 'requireLogin'
    req.user.credits += 5;
    const user = await req.user.save();

    //send user back inside response to request
    res.send(user);
  });
};
