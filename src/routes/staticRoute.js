const staticController = require('../controllers/staticController');

module.exports = app => {
  app.get('/', staticController.index);
};
