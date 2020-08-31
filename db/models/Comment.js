const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = require("./User");

const commentSchema = new Schema({
  created_at: Date,
  resource_id: {
    type: Schema.Types.ObjectId,
    ref: "Resource",
  },
  _user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  body: String,
});
commentSchema.pre("deleteOne", { query: true }, function (next) {
  let id = this.getQuery()["_id"];
  mongoose
    .model("Resource")
    .updateOne({}, { $pull: { comments: id } }, { multi: true }, next);

  mongoose
    .model("User")
    .updateOne({}, { $pull: { comments: id } }, { multi: true }, next);
});
mongoose.model("Comment", commentSchema);
