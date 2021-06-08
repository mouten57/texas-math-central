const mongoose = require("mongoose");
const { Schema } = mongoose;

const resourceViewsSchema = new Schema({
  resource_id: {
    type: Schema.Types.ObjectId,
    ref: "Resource",
  },
  viewed_on: String,
  views: Number,
});

mongoose.model("ResourceViews", resourceViewsSchema);
