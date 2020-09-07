const mongoose = require("mongoose");
const Cart = mongoose.model("Cart");
const Resource = mongoose.model("Resource");

module.exports = {
  async getCart(_user, callback) {
    let cart = await Cart.findOneAndUpdate(
      {
        _user,
      },
      {
        $set: {
          updated_at: Date.now(),
        },
      },
      { upsert: true, returnNewDocument: true }
    ).populate({ path: "products", populate: "resource_id" });

    try {
      callback(null, cart);
    } catch (err) {
      callback(err);
    }
  },
  async addToCart(_user, resource_id, callback) {
    let resource = await Resource.findOne({ _id: resource_id });

    let product = {
      resource_id,
      quantity: 1,
      name: resource.name,
      price: 1,
    };
    let cart = await Cart.findOneAndUpdate(
      {
        _user,
        //don't add resource if it's already there
        "products.resource_id": { $ne: resource_id },
      },
      {
        $set: {
          updated_at: Date.now(),
        },
        $push: { products: product },
      },
      { upsert: true, returnNewDocument: true }
    );
    try {
      callback(null, cart);
    } catch (err) {
      callback(err);
    }
  },
  async removeFromCart(_user, resource_id, callback) {
    let resource = await Resource.findOne({ _id: resource_id });

    let product = {
      resource_id,
      quantity: 1,
      name: resource.name,
      price: 1,
    };
    let cart = await Cart.findOneAndUpdate(
      {
        _user,
      },
      {
        $set: {
          updated_at: Date.now(),
        },
        $pull: { products: product },
      },
      { upsert: true, returnNewDocument: true }
    );
    try {
      callback(null, cart);
    } catch (err) {
      callback(err);
    }
  },
};
