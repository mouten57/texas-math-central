const mongoose = require("mongoose");
const ResourceDownloads = mongoose.model("ResourceDownloads");

module.exports = {
  async increaseDownloadCount(resourceId, callback) {
    const resourceDownloadCount = await ResourceDownloads.findOne({
      resource_id: resourceId,
      viewed_on: current_viewed_on,
    });
    if (resourceDownloadCount) {
      try {
        resourceDownloadCount.download_count++;
        resourceDownloadCount.save();
        callback(null, resourceDownloadCount);
      } catch (err) {
        callback(err);
      }
    } else {
      let newResourceDownloadCount = {
        resource_id: resourceId,
        viewed_on: current_viewed_on,
        download_count: 1,
      };
      try {
        var createdCount = await ResourceDownloads.create(
          newResourceDownloadCount
        );
        callback(null, createdCount);
      } catch (err) {
        callback(err);
      }
    }
  },
};
