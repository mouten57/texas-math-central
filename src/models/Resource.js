const mongoose = require('mongoose');
const { Schema } = mongoose;

const resourceSchema = new Schema({
  name: String,
  //dropdown
  unit: String,
  type: String,
  link: String,
  description: String,
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  dateSent: Date,
  lastResponded: Date
});

mongoose.model('resources', resourceSchema);
