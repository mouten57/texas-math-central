const mongoose = require('mongoose');
const { Schema } = mongoose;

const voteSchema = new Schema({
  value: {
    type: Number,
    validate: {
      validator: function(v) {
        if (v === 1 || v === -1) {
          return v;
        }
      },
      message: props => `${props.value} is not a vote!`
    },
    required: true
  },
  resource_id: {
    type: Schema.Types.ObjectId,
    ref: 'Resource',
    required: true
  },

  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

//create a new collection called users
//two arguments means we are loading something into mongoose
//one argument means we are fetching something
mongoose.model('votes', voteSchema);
