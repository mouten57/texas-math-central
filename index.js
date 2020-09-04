const express = require("express");
const mainConfig = require("./config/main-config");
const routeConfig = require("./config/route-config.js");
// const keys = require("./config/keys/keys");
// var companion = require("@uppy/companion");
// const path = require("path");
// const destFilePath = path.resolve("uploads");

const app = express();
// const options = {
//   providerOptions: {
//     drive: {
//       key: keys.googleClientID,
//       secret: keys.googleClientSecret,
//     },
//   },
//   server: {
//     host: "localhost:5000",
//     protocol: "http",
//   },
//   filePath: destFilePath,
//   secret: keys.cookieKey,
//   debug: true,
// };
//main setup
mainConfig.init(app, express);

//route setup
routeConfig.init(app);

//express to behave in production
if (process.env.NODE_ENV === "production") {
  //Express will serve up production assets
  //like our main.js file, or main.css file!
  app.use(express.static("client/build"));

  //Express will serve up index.html file if it doesn't
  //recognize the route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`now listening on port ${PORT}`);
});
// app.use(companion.app(options));
