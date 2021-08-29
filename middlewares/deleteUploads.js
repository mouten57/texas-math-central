const fs = require("fs");
const path = require("path");
const directory = "./uploads";

module.exports = function () {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;
    console.log("deleting files", files);

    for (const file of files) {
      if (
        !(file.includes("Connect") || file.includes("original_watermark.png"))
      ) {
        fs.unlink(path.join(directory, file), (err) => {
          if (err) throw err;
        });
      }
    }
    return;
  });
};
