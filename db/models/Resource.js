const mongoose = require("mongoose");
const { Schema } = mongoose;
const commentSchema = require("./Comment");
const userSchema = require("./User");
const favoriteSchema = require("./Favorite");

const resourceSchema = new Schema({
  name: String,
  unit: String,
  fullUnit: String,
  type: String,
  link: String,
  description: String,
  _user: { type: Schema.Types.ObjectId, ref: "User" },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  favorites: [{ type: Schema.Types.ObjectId, ref: "Favorite" }],
  votes: [{ type: Schema.Types.ObjectId, ref: "Vote" }],
  created_at: Date,
  files: Array,
  s3Object: Object,
  s3Link: String,
});

mongoose.model("Resource", resourceSchema);
