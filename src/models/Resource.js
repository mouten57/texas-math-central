const mongoose = require('mongoose');
const { Schema } = mongoose;

const resourceSchema = new Schema({
  title: String,
  body: String,
  subject: String,
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  dateSent: Date,
  lastResponded: Date
});

mongoose.model('resources', resourceSchema);
