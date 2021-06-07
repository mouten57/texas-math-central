const fs = require("fs");
const os = require("os");
const uuid = require("uuid");
const path = require("path");
const keys = require("../config/keys/keys");
const { google } = require("googleapis");
var mime = require("mime-types");
const { doesNotMatch } = require("assert");
const oauth2Client = new google.auth.OAuth2(
  keys.googleClientID,
  keys.googleClientSecret,
  keys.googleRedirectURIs[0]
);

const drive = google.drive({
  version: "v2",
  auth: oauth2Client,
});

async function runSample(files, auth) {
  console.log(files, auth);

  oauth2Client.setCredentials({ access_token: auth.access_token });
  // Obtain user credentials to use for the request

  // For converting document formats, and for downloading template
  // documents, see the method drive.files.export():
  // https://developers.google.com/drive/api/v3/manage-downloads

  const downloadFile = (file) => {
    const fileId = file.id;
    const { name, mimeType } = file;
    return drive.files
      .get({ fileId, alt: "media" }, { responseType: "stream" })
      .then((res) => {
        return new Promise((resolve, reject) => {
          var ext = mime.extension(mimeType);
          const filePath = path.join(
            os.tmpdir(),
            `${uuid.v4()}.${ext ? ext : path.extname(name)}`
          );
          console.log(`writing to ${filePath}`);
          const dest = fs.createWriteStream(filePath);
          let progress = 0;

          res.data
            .on("end", () => {
              console.log("Done downloading file.");
              resolve(filePath);
            })
            .on("error", (err) => {
              console.error("Error downloading file.");
              reject(err);
            })
            .on("data", (d) => {
              progress += d.length;
              if (process.stdout.isTTY) {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(`Downloaded ${progress} bytes`);
              }
            })
            .pipe(dest);
        });
      });
  };

  const convertFile = async (file, done) => {
    var convert_to;
    switch (file.mimeType) {
      case "application/vnd.google-apps.presentation":
        convert_to =
          "application/vnd.openxmlformats-officedocument.presentationml.presentation";
        break;
      case "application/vnd.google-apps.document":
        convert_to =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        break;
      default:
        convert_to = "application/pdf";
    }
    var ext = mime.extension(convert_to);
    const filePath = path.join(os.tmpdir(), `${uuid.v4()}.${ext}`);
    const dest = fs.createWriteStream(filePath);
    const { data } = await drive.files.export(
      {
        fileId: file.id,
        mimeType: convert_to,
      },
      {
        responseType: "stream",
      }
    );

    data
      .on("end", function () {
        console.log("Done");
      })
      .on("error", function (err) {
        console.log("Error during download", err);
      })
      .pipe(dest);
  };

  handleFile = (file) => {
    if (file.mimeType.includes("google-apps")) {
      return convertFile(file);
    } else {
      downloadFile(file);
    }
  };

  if (files.length == 1) {
    return handleFile(files[0]);
  } else if (files.length > 1) {
    for (let i = 0; i < files.length; i++) {
      handleFile(files[i]);
    }
  }
}

if (module === require.main) {
  if (process.argv.length !== 3) {
    throw new Error("Usage: node samples/drive/download.js $FILE_ID");
  }
  const fileId = process.argv[2];
  runSample(fileId).catch(console.error);
}
module.exports = runSample;
