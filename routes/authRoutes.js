const passport = require('passport');

module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  //back with the code from google
  //now exchange code for actual user profile
  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      console.log(req.session.token, 'req session token in auth routes');
      req.session.token = req.user.token;

      res.redirect('/');
    }
  );

  app.get('/api/logout', (req, res) => {
    console.log(`hey, here is the user that just signed out: ${req.user}`);
    req.logout();
    res.redirect('/');
  });

  //route handler for user
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
