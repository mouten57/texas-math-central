const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  credits: { type: Number, default: 0 }
});
//create a new collection called users
//two arguments means we are loading something into mongoose
//one argument means we are fetching something
mongoose.model('users', userSchema);
