const fs = require("fs");
const os = require("os");
const uuid = require("uuid");
const path = require("path");
const keys = require("../config/keys/keys");
const { google } = require("googleapis");
var mime = require("mime-types");

const oauth2Client = new google.auth.OAuth2(
  keys.googleClientID,
  keys.googleClientSecret,
  keys.googleRedirectURIs[0]
);

const drive = google.drive({
  version: "v2",
  auth: oauth2Client,
});

async function runSample(files, auth, cb) {
  console.log(files, auth);

  oauth2Client.setCredentials({ access_token: auth.access_token });
  // Obtain user credentials to use for the request

  // For converting document formats, and for downloading template
  // documents, see the method drive.files.export():
  // https://developers.google.com/drive/api/v3/manage-downloads

  //START HERE
  if (files.length == 1) {
    var filePath = await handleFile(files[0]);
    try {
      cb(null, filePath);
    } catch (err) {
      return cb(err);
    }
  } else if (files.length > 1) {
    const filePathList = [];
    for (let i = 0; i < files.length; i++) {
      try {
        let filePath = await handleFile(files[i]);
        filePathList.push(filePath);
      } catch (err) {
        return cb(err);
      }
    }

    cb(null, filePathList);
  }
}

const handleFile = (file) => {
  if (file.mimeType.includes("google-apps")) {
    return convertFile(file).then((f) => {
      return f;
    });
  } else {
    return downloadFile(file);
  }
};

const downloadFile = (file) => {
  const fileId = file.id;
  const { name, mimeType } = file;
  var ext = mime.extension(mimeType);
  const filePath = path.join(
    os.tmpdir(),
    `${uuid.v4()}.${ext ? ext : path.extname(name)}`
  );
  const dest = fs.createWriteStream(filePath);
  drive.files
    .get({ fileId, alt: "media" }, { responseType: "stream" })
    .then((res) => {
      return new Promise((resolve, reject) => {
        console.log(`writing to ${filePath}`);

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
  return filePath.replace(/\\/g, "/");
};

const convertFile = async (file) => {
  var convert_to;
  console.log(file.mimeType);
  switch (file.mimeType) {
    //having ERRORS WHEN CONVERTING PPT AND NOT ABLE TO HANDLE THEM CORRECTLY. DEFAULTING TO PDF FOR NOW
    // case "application/vnd.google-apps.presentation":
    //   convert_to =
    //     "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    //   break;
    case "application/vnd.google-apps.document":
      convert_to =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      break;
    default:
      convert_to = "application/pdf";
  }
  var ext = mime.extension(convert_to);
  const filePath = path.join(os.tmpdir(), `${uuid.v4()}.${ext}`);
  console.log(filePath);
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
      console.log("Done converting file.");
    })
    .on("error", function (err) {
      return err;
    })
    .pipe(dest);
  try {
    await data;
    return filePath.replace(/\\/g, "/");
  } catch (err) {
    return err;
  }
};

if (module === require.main) {
  if (process.argv.length !== 3) {
    throw new Error("Usage: node samples/drive/download.js $FILE_ID");
  }
  const fileId = process.argv[2];
  runSample(fileId).catch(console.error);
}
module.exports = runSample;
