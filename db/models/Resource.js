const mongoose = require("mongoose");
const { Schema } = mongoose;
const commentSchema = require("./Comment");
const userSchema = require("./User");

const uploadSchema = new Schema({
  name: String,
  unit: String,
  fullUnit: String,
  type: String,
  link: String,
  description: String,
  _user: [userSchema],
  created: Date,
  file: Object,
  s3Object: Object,
  s3Link: String,
  file_data: Buffer,
});

mongoose.model("resources", uploadSchema);
