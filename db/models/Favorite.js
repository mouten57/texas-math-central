const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = require("./User");

const favoriteSchema = new Schema({
  created_at: Date,
  resource_id: {
    type: Schema.Types.ObjectId,
    ref: "Resource",
  },
  _user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

mongoose.model("Favorite", favoriteSchema);
