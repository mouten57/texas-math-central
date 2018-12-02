const mongoose = require('mongoose');
const { Schema } = mongoose;
const resourceSchema = require('./Resource');
const userSchema = require('./User');

const uploadSchema = new Schema({
  name: String,
  unit: String,
  type: String,
  link: String,
  description: String,
  _user: [userSchema],
  dateSent: Date,
  file_name: String,
  file_type: String,
  file_path: String,
  file_data: Buffer,
  comments: [resourceSchema]
});

mongoose.model('resources', uploadSchema);
