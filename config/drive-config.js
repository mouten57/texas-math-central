const mongoose = require("mongoose");
const fs = require("fs");
const { google } = require("googleapis");
const keys = require("./keys/keys");
const User = mongoose.model("User");
const axios = require("axios");

const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];

module.exports = {
  start: async function (req, res, next) {
    //find user
    const user = await User.findOne({ _id: req.user._id });
    //start authorizing

    authorize(keys, final);

    function authorize(
      { googleClientID, googleClientSecret, drive_redirect_uris },
      callback
    ) {
      const oAuth2Client = new google.auth.OAuth2(
        googleClientID,
        googleClientSecret,
        drive_redirect_uris[0]
      );

      // Check if we have previously stored a token.
      //will want to check user.driveToken

      if (user.driveAccessToken) {
        oAuth2Client.setCredentials(user.driveToken);
        callback(res, oAuth2Client);
      } else {
        return getAccessToken(oAuth2Client, callback);
      }
    }

    function getAccessToken(oAuth2Client, callback) {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
      });
      //generate authURL give me this:
      //https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=http://localhost:5000/auth/drive/callback&client_id={{client_id}}

      //authUrl is what I need to visit to see the interface
      return res.redirect(authUrl);

      //once I click on my name and authorize, it hits the callback with the code
    }
  },
  finish: function (req, res, next) {
    console.log("in finish");
    let code = req.query.code;
    const { googleClientID, googleClientSecret, drive_redirect_uris } = keys;
    const url = "https://oauth2.googleapis.com/token";
    let params = {
      client_id: googleClientID,
      client_secret: googleClientSecret,
      code: code,
      redirect_uri: drive_redirect_uris[0],
      grant_type: "authorization_code",
    };
    console.log(code);

    //with the code I can do this:
    axios({
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params,
    }).then((response) => {
      const { access_token, refresh_token } = response.data;
      User.findOneAndUpdate(
        { _id: req.user._id },
        { driveAccessToken: access_token, driveRefreshToken: refresh_token },
        { upsert: true, returnNewDocument: true }
      ).then((user) => {
        res.send(user);
      });
    });
  },
};
const final = function (res, oauth2client) {
  res.send(oauth2client);
};
