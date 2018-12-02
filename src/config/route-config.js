module.exports = {
  init(app) {
    if (process.env.NODE_ENV === 'test') {
      const mockAuth = require('../../spec/support/mock-auth.js');
      mockAuth.fakeIt(app);
    }

    require('../routes/authRoutes')(app);
    require('../routes/resourceRoutes')(app);
    require('../routes/commentRoutes')(app);
  }
};
