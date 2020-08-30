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
  _user: [userSchema],
  favorites: [favoriteSchema],
  created_at: Date,
  files: Array,
  s3Object: Object,
  s3Link: String,
});

mongoose.model("Resource", resourceSchema);
