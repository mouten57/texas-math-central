const mongoose = require("mongoose");
const ResourceViews = mongoose.model("ResourceViews");

const today = new Date();
const isToday = (someDate) => {
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

function addDays(myDate, days) {
  var result = new Date(myDate);

  result.setDate(result.getDate() + days);
  return result.toDateString();
}
//TODAY
const current_viewed_on = addDays(new Date(), 0);

module.exports = {
  async increaseViewCount(resourceId, callback) {
    const resourceViewCount = await ResourceViews.findOne({
      resource_id: resourceId,
      viewed_on: current_viewed_on,
    });
    if (resourceViewCount) {
      try {
        resourceViewCount.views++;
        resourceViewCount.save();
        callback(null, resourceViewCount);
      } catch (err) {
        callback(err);
      }
    } else {
      let newResourceViewCount = {
        resource_id: resourceId,
        viewed_on: current_viewed_on,
        views: 1,
      };
      try {
        var createdCount = await ResourceViews.create(newResourceViewCount);
        callback(null, createdCount);
      } catch (err) {
        callback(err);
      }
    }
  },
};
