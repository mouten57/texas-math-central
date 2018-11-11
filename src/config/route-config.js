module.exports = {
  init(app) {
    if (process.env.NODE_ENV === 'test') {
      const mockAuth = require('../../spec/support/mock-auth.js');
      mockAuth.fakeIt(app);
    }

    require('../routes/staticRoute')(app);
    require('../routes/authRoutes')(app);
  }
};
