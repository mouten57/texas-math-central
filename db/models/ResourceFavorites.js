const mongoose = require("mongoose");
const { Schema } = mongoose;

const resourceFavoritesSchema = new Schema({
  resource_id: {
    type: Schema.Types.ObjectId,
    ref: "Resource",
  },
  viewed_on: Date,
  favorite_count: Number,
});

mongoose.model("ResourceFavorites", resourceFavoritesSchema);
