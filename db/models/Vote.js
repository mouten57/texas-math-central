const mongoose = require("mongoose");
const { Schema } = mongoose;

const voteSchema = new Schema({
  created_at: {
    type: Date,
    default: new Date(),
  },
  updated_at: {
    type: Date,
    default: new Date(),
  },
  value: {
    type: Number,
    validate: {
      validator: function (v) {
        if (v === 1 || v === -1) {
          return v;
        }
      },
      message: (props) => `${props.value} is not a vote!`,
    },
    required: true,
  },
  resource_id: {
    type: Schema.Types.ObjectId,
    ref: "Resource",
    required: true,
  },

  _user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

voteSchema.pre("deleteOne", { query: true }, function (next) {
  let id = this.getQuery()["_id"];

  mongoose
    .model("User")
    .updateOne({}, { $pull: { votes: id } }, { multi: true }, next);
});

//create a new collection called users
//two arguments means we are loading something into mongoose
//one argument means we are fetching something
mongoose.model("Vote", voteSchema);
