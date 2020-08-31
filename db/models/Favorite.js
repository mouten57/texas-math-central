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

favoriteSchema.pre("deleteOne", { query: true }, async function (next) {
  let id = this.getQuery()["_id"];

  await mongoose
    .model("Resource")
    .update({}, { $pull: { favorites: id } }, { multi: true });
  await mongoose
    .model("User")
    .update({}, { $pull: { favorites: id } }, { multi: true });
  try {
    next;
  } catch (err) {
    throw err;
  }
});

mongoose.model("Favorite", favoriteSchema);
