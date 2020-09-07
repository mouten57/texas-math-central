const resourceQueries = require("../db/queries.resources");
const unitFields = require("../helpers/unitFields");
const fs = require("fs");
var AWS = require("aws-sdk");
const awsConfig = require("../config/aws-config");
const keys = require("../config/keys/keys");
const deleteUploads = require("../middlewares/deleteUploads");
var { s3 } = awsConfig;
var convertapi = require("convertapi")(keys.convertapi_KEY);
var im = require("imagemagick");
const path = require("path");
const { settings } = require("cluster");
const filetype_settings = require("../helpers/filetype_settings");

const fullUnit = (unit) => {
  for (let i = 0; i < unitFields.length; i++) {
    if (unitFields[i].param == unit) {
      return unitFields[i].name;
    }
  }
};

module.exports = {
  index(req, res, next) {
    resourceQueries.getUnitResources(req.params.unit, (err, resources) => {
      if (err) {
        res.status(422).send(err);
      } else {
        res.send(resources);
      }
    });
  },

  show(req, res, next) {
    resourceQueries.getResource(req.params.id, (err, resource) => {
      if (err) {
        res.status(422).send(err);
      } else {
        res.send(resource);
      }
    });
  },

  async create(req, res, next) {
    var files = req.files || [],
      newResource,
      link = req.body.link;
    // var files_plus_data = [...files];

    var newResource = {
      name: req.body.name,
      unit: req.body.unit,
      fullUnit: fullUnit(req.body.unit),
      type: req.body.type,
      link,
      description: req.body.description,
      _user: req.user._id,
      created_at: Date.now(),
      files: ["TBD"],
    };
    resourceQueries.addResource(newResource, async (err, resource) => {
      if (err) {
        res.send(err);
      } else {
        res.send(resource);
        //after sending initial, send files
        //start upload with aws
        for (let i = 0; i < files.length; i++) {
          console.log(files[i].filename);
          const params = {
            Bucket: "texas-math-central",
            Key: files[i].filename,
            Body: fs.readFileSync(`./uploads/${files[i].filename}`),
          };

          //only kick off conversion process if NOT an image
          if (!files[i].mimetype.includes("image")) {
            let file_ext = path.extname(files[i].filename).substring(1);
            let file_path = `./uploads/${files[i].filename}`;

            //only do first conversion if NOT a pdf
            if (file_ext != "pdf") {
              let result = await convertapi.convert(
                "pdf",
                filetype_settings(file_path, file_ext),
                file_ext
              );

              function convertImage() {
                return new Promise((resolve, reject) => {
                  im.convert(
                    [
                      "-flatten",
                      "-background",
                      "#fff",
                      "-quality",
                      100,
                      // "-resize",
                      // "1530x1980",
                      `./uploads/${files[i].filename}.pdf`,
                      `./uploads/${files[i].filename}.jpg`,
                    ],
                    function (err, stdout) {
                      if (err) {
                        reject(err);
                      }
                      resolve(stdout);
                    }
                  );
                });
              }

              await result.file.save(`./uploads/${files[i].filename}.pdf`);

              //optional: use imagemagick to convert pdf to jpg
              await convertImage();

              let s3Data = await s3
                .upload({
                  Bucket: "texas-math-central",
                  Key: `${files[i].filename}.jpg`,
                  Body: fs.readFileSync(`./uploads/${files[i].filename}.jpg`),
                })
                .promise();
              files[i].previewLink = s3Data.Location;
            }

            //optional: use convertapi again to convert pdf to thumbnail
            // await convertapi
            //   .convert(
            //     "thumbnail",
            //     {
            //       File: `./uploads/${files[i].filename}${
            //         !file_ext.includes("pdf") ? ".pdf" : ""
            //       }`,
            //       PageRange: "1",
            //       ImageResolution: "72",
            //     },
            //     "pdf"
            //   )
            //   .then(async function (result) {
            //     await result.saveFiles(`./uploads/${files[i].filename}.jpg`);
            //     let s3Data = await s3
            //       .upload({
            //         Bucket: "texas-math-central",
            //         Key: `${files[i].filename}.jpg`,
            //         Body: fs.readFileSync(`./uploads/${files[i].filename}.jpg`),
            //       })
            //       .promise();
            //     files[i].previewLink = s3Data.Location;
            //   });
          }

          let s3Data = await s3.upload(params).promise();
          files[i].s3Object = s3Data;
          files[i].s3Link = s3Data.Location;
        }

        resourceQueries.updateResourceWithFiles(
          resource._id,
          files,
          async (err, update) => {
            try {
              req.app.io.emit("updated-resource-post-upload", update);

              //delete files from Upload dir
              deleteUploads();
            } catch (err) {
              throw err;
            }
          }
        );
      }
    });
  },
  destroy(req, res, next) {
    resourceQueries.destroyResource(req, (err, result) => {
      if (err || result == null) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  },
  //using when storing docs in mongo
  download(req, res, next) {
    resourceQueries.downloadResource(req.params.resourceId, (err, resource) => {
      if (err || resource == null) {
        res.redirect(404, "/");
      } else {
        const found = resource.files.find(
          (obj) => obj.filename == req.params.filename
        );

        fs.writeFileSync(
          `./uploads/${found.originalname}`,
          found.file_data.buffer
        );

        res.download(`./uploads/${found.originalname}`, (err) => {
          if (err) {
            res.send(err);
          } else {
            //need to delete file after download is complete
            fs.unlink(`./uploads/${found.originalname}`, (err) => {
              if (err) {
                throw err;
              }
            });
          }
        });
      }
    });
  },
};
