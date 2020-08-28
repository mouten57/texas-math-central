const voteController = require("../controllers/voteController");

module.exports = (app) => {
  app.get("/api/resources/:resourceId/votes/upvote", voteController.upvote);

  app.get("/api/resources/:resourceId/votes/downvote", voteController.downvote);

  app.get("/api/resources/:resourceId/votes/total", voteController.getVotes);
};
