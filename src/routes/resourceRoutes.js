const _ = require('lodash');
const Path = require('path-parser').default;
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Resource = mongoose.model('resources');

module.exports = app => {
  app.get('/api/resources', requireLogin, async (req, res) => {
    const resources = await Resource.find({ _user: req.user.id });
    res.send(resources);
  });

  app.post('/api/resources', requireLogin, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const resource = new Resource({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });
    //save our resource
    resource.save((err, resource) => {
      if (err) return console.lerror(err);
      console.log(`${resource.title} saved to collection.`);
    });
  });
};
