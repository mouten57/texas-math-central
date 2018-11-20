const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/api/resources', { target: 'http://localhost:5000' }));
  app.use(proxy('/api/resources/create', { target: 'http://localhost:5000' }));
  app.use(proxy('/auth/google', { target: 'http://localhost:5000' }));
};
