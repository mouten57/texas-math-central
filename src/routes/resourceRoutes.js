const resourcesController = require('../controllers/resourcesController');

module.exports = app => {
  app.get('/resources', resourcesController.index);
};
