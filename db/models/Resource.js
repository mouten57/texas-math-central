const mongoose = require("mongoose");
const { Schema } = mongoose;

const resourceSchema = new Schema({
  name: String,
  subject: String,
  grade: String,
  unit: String,
  fullUnit: String,
  type: String,
  link: String,
  description: String,
  _user: { type: Schema.Types.ObjectId, ref: "User" },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  favorites: [{ type: Schema.Types.ObjectId, ref: "Favorite" }],
  votes: [{ type: Schema.Types.ObjectId, ref: "Vote" }],
  created_at: Date,
  files: Array,
  s3Object: Object,
  s3Link: String,
});
//worry about this later
// resourceSchema.pre("create", { query: true }, function (next) {
//   let id = this.getQuery()["_id"];
//   this.model("User").updateOne({}, { $push: { resources: id } }, next);
// });

resourceSchema.pre("deleteOne", { document: true }, async function (next) {
  this.model("User").updateMany(
    {},
    { $pull: { resources: this._id } },
    { multi: true },
    next
  );
  this.model("Cart").updateMany(
    {},
    { $pull: { products: { resource_id: this._id } } },
    { multi: true },
    next
  );
  let comments = await this.model("Comment").find({ resource_id: this._id });
  for (let i = 0; i < comments.length; i++) {
    await this.model("Comment").deleteOne({ _id: comments[i]._id });
  }

  let votes = await this.model("Vote").find({ resource_id: this._id });
  for (let i = 0; i < votes.length; i++) {
    await this.model("Vote").deleteOne({ _id: votes[i]._id });
  }

  let favorites = await this.model("Favorite").find({ resource_id: this._id });
  for (let i = 0; i < favorites.length; i++) {
    await this.model("Favorite").deleteOne({ _id: favorites[i]._id });
  }
});
resourceSchema.post("deletOne", { document: true }, async function (next) {
  next;
});

mongoose.model("Resource", resourceSchema);
