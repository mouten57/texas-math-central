const mongoose = require("mongoose");
const Cart = mongoose.model("Cart");
const Resource = mongoose.model("Resource");
const User = mongoose.model("User");

module.exports = {
  async postcharge(_user, resource_ids, callback) {
    //add purchased items to user
    let user = await User.findOneAndUpdate(
      { _id: _user },
      //addToSet adds a value to an array unless the value is already present, in which case $addToSet does nothing to that array.
      { $addToSet: { purchasedResources: { $each: resource_ids } } },
      { upsert: true, returnNewDocument: true }
    );

    //find and clear current user's cart
    await Cart.findOneAndUpdate(
      {
        _user,
      },
      {
        $set: {
          updated_at: Date.now(),
          products: [],
        },
      },
      { upsert: true, returnNewDocument: true }
    );

    try {
      console.log(user);
      callback(null, user);
    } catch (err) {
      callback(err);
    }
  },
  async all_access_postcharge(_user, callback) {
    //add purchased items to user
    let user = await User.findOneAndUpdate(
      { _id: _user },
      //addToSet adds a value to an array unless the value is already present, in which case $addToSet does nothing to that array.
      { role: "all_access" },
      { upsert: true, returnNewDocument: true }
    );

    try {
      console.log(user);
      callback(null, user);
    } catch (err) {
      callback(err);
    }
  },
};
