const passport = require('passport');

module.exports = {
  signIn(req, res, next) {
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })(req, res, () => {
      if (!req.user) {
        req.flash('notice', 'Sign in failed. Please try again.');
        res.redirect('/');
      } else {
        req.flash('notice', `Welcome back, ${req.user.name}!`);
        res.redirect('/');
      }
    });
  }
};
