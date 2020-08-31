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

favoriteSchema.pre("deleteOne", { query: true }, function (next) {
  let id = this.getQuery()["_id"];
  mongoose
    .model("Resource")
    .updateOne({}, { $pull: { favorites: id } }, { multi: true }, next);
  mongoose
    .model("User")
    .updateOne({}, { $pull: { favorites: id } }, { multi: true }, next);
});

mongoose.model("Favorite", favoriteSchema);
