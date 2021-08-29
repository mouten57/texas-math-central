// Load the SDK and UUID
var AWS = require("aws-sdk");
const fs = require("fs");
const keys = require("../config/keys/keys");

// Create unique bucket name
var bucketName = "texas-math-central";
// Create name for uploaded object key
//get file name from multer? local upload?

// Create a promise on S3 service object
var s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  accessKeyId: keys.AWS_ACCESS_KEY,
  secretAccessKey: keys.AWS_SECRET_ACCESS_KEY,
});

module.exports = {
  upload: function (file, callback) {
    if (file !== undefined) {
      //var fileName = file.mimetype == "image/jpeg" ? imagePath : file.path;
    }
    const fileContent = fs.readFileSync(file.path);

    const params = {
      Bucket: bucketName,
      Key: file.filename,
      Body: fileContent,
    };
    s3.upload(params, (s3Err, data) => {
      if (s3Err) callback(s3Err);
      callback(null, data);
    });
  },
  s3,
};
