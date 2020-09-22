const mongoose = require("mongoose");
const { Schema } = mongoose;
const CartSchema = new mongoose.Schema({
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  products: [
    {
      resource_id: {
        type: Schema.Types.ObjectId,
        ref: "Resource",
      },
      dateAdded: { type: Date, default: Date.now() },
      quantity: Number,
      name: String,
      price: Number,
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cart", CartSchema);
