const requireLogin = require('../middlewares/requireLogin');
const resourceController = require('../controllers/resourceController');
const mongoose = require('mongoose');
const Resource = mongoose.model('resources');

module.exports = app => {
  app.get('/api/resources', requireLogin, resourceController.index);

  app.post('/api/resources/create', requireLogin, (req, res) => {
    const { name, unit, type, link, description } = req.body;

    const resource = new Resource({
      name,
      unit,
      type,
      link,
      description,
      _user: req.user.id,
      dateSent: Date.now()
    });
    //save our resource
    resource.save((err, resource) => {
      if (err) return console.lerror(err);
      console.log(`${resource.name} saved to collection.`);
    });
  });

  app.get('/api/resources/:id', resourceController.show);
};
