const mongoose = require('mongoose');
const { Schema } = mongoose;

const uploadSchema = new Schema({
  name: String,
  type: String,
  path: String,
  data: Buffer
});

mongoose.model('uploads', uploadSchema);
