const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  role: { type: String, default: "standard" },
  name: String,
  nickname: String,
  image: String,
  token: String,
  resources: [{ type: Schema.Types.ObjectId, ref: "Resource" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  favorites: [{ type: Schema.Types.ObjectId, ref: "Favorite" }],
  votes: [{ type: Schema.Types.ObjectId, ref: "Vote" }],
  purchasedResources: [{ type: Schema.Types.ObjectId, ref: "Resource" }],
});

//create a new collection called users
//two arguments means we are loading something into mongoose
//one argument means we are fetching something
mongoose.model("User", userSchema);
