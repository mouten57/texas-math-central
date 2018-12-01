const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  resource_id: {
    type: Schema.Types.ObjectId,
    ref: 'Resource'
  },
  posted: Date,
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  text: String
});
//create a new collection called comments
//two arguments means we are loading something into mongoose
//one argument means we are fetching something
mongoose.model('comments', commentSchema);
