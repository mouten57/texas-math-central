const mongoose = require('mongoose');
const { Schema } = mongoose;

const uploadSchema = new Schema({
  name: String,
  unit: String,
  type: String,
  link: String,
  description: String,
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  dateSent: Date,
  file_name: String,
  file_type: String,
  file_path: String,
  file_data: Buffer
});

mongoose.model('resources', uploadSchema);
