const mongoose = require("mongoose");
const { Schema } = mongoose;

const resourceDownloadsSchema = new Schema({
  resource_id: {
    type: Schema.Types.ObjectId,
    ref: "Resource",
  },
  viewed_on: Date,
  download_count: Number,
});

mongoose.model("ResourceDownloads", resourceDownloadsSchema);
