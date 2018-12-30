const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys/keys');

//one arguments means we are fetching something from mongoose
const User = mongoose.model('users');

//user is whatever we pulled out of the database
passport.serializeUser((user, done) => {
  //user.id is the identifying piece of info that identifies user in follow-up requests
  //user.id is the id auto-created by MONGODB
  //every user will HAVE THIS..not every user will have google profile.id or whatever....
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      //route user is sent to after they grant permissions to google
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    //callback function -> when user gets back home, it brings this accessToken
    //here is our chance to get user info and create new user in our database
    async (accessToken, refreshToken, profile, done) => {
      //query returns a promise!
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        //we already have a record with the given profile ID
        //null means we are all good! then return the user file!

        return done(null, existingUser);
      }

      //we dont have a user record with this ID, make a new record!
      //creates one new record of a user that exists in node APT only
      //.save persists this to mongo database
      const user = await new User({
        googleId: profile.id,
        name: profile.displayName,
        nickname: profile.name.givenName,
        image: profile.photos[0].value,
        token: accessToken
      }).save();
      done(null, user);
    }
  )
);
