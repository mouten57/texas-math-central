const http = require("http"); // or 'https' for https:// URLs
const fs = require("fs");
const os = require("os");
const path = require("path");
var https = require("https");

module.exports = function (url_param) {
  var url = new URL(url_param);
  var client = http;

  client = url.protocol == "https:" ? https : client;
  const file_name = url.pathname.substring(1);
  const temp_dir = path.resolve("client/src/temp", "temp.pdf");
  console.log(temp_dir);
  const file = fs.createWriteStream(temp_dir);
  client.get(url, function (response) {
    response.pipe(file);
  });
};
