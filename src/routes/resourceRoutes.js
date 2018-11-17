const requireLogin = require('../middlewares/requireLogin');
const resourceController = require('../controllers/resourceController');

module.exports = app => {
  // app.get('/api/units/:id', requireLogin, async (req, res) => {

  // })
  app.get('/api/resources', resourceController.index);

  app.post('/api/resources', requireLogin, async (req, res) => {
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
};
