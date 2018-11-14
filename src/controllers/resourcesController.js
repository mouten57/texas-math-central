const resourceTopics = require('../helpers/resourceTopics');

module.exports = {
  index(req, res, next) {
    res.render('resources/index', {
      title: 'Texas Math Central',
      resourceTopics
    });
  }
};
