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

commentSchema.post("save", async function (next) {
  await mongoose
    .model("Resource")
    .update({ _id: this.resource_id }, { $push: { comments: this._id } });

  await mongoose
    .model("User")
    .update({ _id: this._user }, { $push: { comments: this._id } });
  try {
    next;
  } catch (err) {
    throw err;
  }
});

commentSchema.pre("deleteOne", { query: true }, async function (next) {
  let id = this.getQuery()["_id"];
  await mongoose
    .model("Resource")
    .update({}, { $pull: { comments: id } }, { multi: true });

  await mongoose
    .model("User")
    .update({}, { $pull: { comments: id } }, { multi: true });
  try {
    next;
  } catch (err) {
    throw err;
  }
});

mongoose.model("Comment", commentSchema);
