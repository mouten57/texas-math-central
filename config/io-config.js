const axios = require("axios");
const keys = require("./keys/keys");

module.exports = function (io) {
  io.on("connection", (client) => {
    console.log("A client has connected!");
  });
};
