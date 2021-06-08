const resourceQueries = require("../db/queries.resources");
const unitFields = require("../helpers/unitFields");
const fs = require("fs");
var AWS = require("aws-sdk");
const awsConfig = require("../config/aws-config");
const keys = require("../config/keys/keys");
const deleteUploads = require("../middlewares/deleteUploads");
var { s3 } = awsConfig;
var convertapi = require("convertapi")(keys.convertapi_KEY);
// var im = require("imagemagick");
const path = require("path");
const filetype_settings = require("../helpers/filetype_settings");
const { create_watermark } = require("../middlewares/create_watermark");
const driveDownload = require("../middlewares/driveDownload");

module.exports = {
  index(req, res, next) {
    resourceQueries.getAllResources(req, (err, resources) => {
      if (err) {
        res.status(422).send(err);
      } else {
        res.send(resources);
      }
    });
  },
  getUnitResources(req, res, next) {
    resourceQueries.getUnitResources(
      req.params.unit,
      req.query,
      (err, resources) => {
        if (err) {
          res.status(422).send(err);
        } else {
          res.send(resources);
        }
      }
    );
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
  getDriveFiles(req, res, next) {
    //sending entire file (just the first one)
    driveDownload(
      req.body.docs,
      req.session.drive_auth,
      (err, filePathList) => {
        if (err) {
          console.log("FAIL");
          return res.send(err);
        } else {
          console.log(filePathList);
          res.send(filePathList);
        }
      }
    );
  },
  create(req, res, next) {
    var files = req.files || [],
      newResource;
    var googleFiles = JSON.parse(req.body.googleFiles);
    // var files_plus_data = [...files];
    //put google files first so i can grab the right file location with 0 index on line 126
    files = googleFiles.concat(files);

    const {
      name,
      grade,
      subject,
      unit,
      type,
      link,
      description,
      fullUnit,
      free,
      googleFileDownloads,
    } = req.body;
    var newResource = {
      name,
      grade,
      subject,
      googleFiles,
      googleFileDownloads,
      free: free == "true",
      unit,
      fullUnit,
      type,
      link,
      description,
      _user: req.user._id,
      created_at: Date.now(),
      files: ["TBD"],
    };
    //parse the file location array so it doesnt return as a string but returns as an array
    const parsed_googleFileDownloads =
      googleFileDownloads != "undefined"
        ? JSON.parse(googleFileDownloads)
        : null;
    console.log(parsed_googleFileDownloads);

    resourceQueries.addResource(newResource, async (err, resource) => {
      if (err) {
        res.send(err);
      } else {
        res.send(resource);
        //after sending initial, send files
        //start upload with aws
        for (let i = 0; i < files.length; i++) {
          // set all vars together
          var file_ext,
            Key,
            file_path,
            watermark_pdf_filepath,
            watermark_pdf_key;
          if (files[i].url?.includes("google")) {
            //if extname exists
            if (path.extname(files[i].name)) {
              file_ext = path.extname(files[i].name).toLowerCase();
              Key = files[i].name;
            } else {
              file_ext = path
                .extname(parsed_googleFileDownloads[i])
                .toLowerCase();
              Key = `${files[i].name}${file_ext}`;
            }
            file_path = parsed_googleFileDownloads[i];
            watermark_pdf_filepath = parsed_googleFileDownloads[i].replace(
              file_ext,
              `_watermark${file_ext}.pdf`
            );
            watermark_pdf_key = files[i].name.replace(
              file_ext,
              `_watermark${file_ext}.pdf`
            );
          } else {
            file_ext = path.extname(files[i].filename).toLowerCase();
            Key = files[i].filename;
            file_path = `./uploads/${files[i].filename}`;
            watermark_pdf_filepath = files[i].path.replace(
              file_ext,
              `_watermark${file_ext}.pdf`
            );
            watermark_pdf_key = files[i].filename.replace(
              file_ext,
              `_watermark${file_ext}.pdf`
            );
          }

          const Body = files[i].url?.includes("google")
            ? fs.readFileSync(`${parsed_googleFileDownloads[i]}`)
            : fs.readFileSync(`./uploads/${files[i].filename}`);

          const params = {
            Bucket: "texas-math-central",
            Key: Key,
            Body: Body,
          };

          //only kick off conversion process if NOT an image
          // if (!files[i].mimetype.includes("image")) {

          let image_types = ".jpg,.jpeg,.png,.bmp,.gif";

          if (!image_types.includes(file_ext)) {
            async function convert_to_pdf_and_watermark() {
              try {
                var file_to_pdf = file_path;

                //if file is NOT PDF, convert it to PDF
                if (file_ext != ".pdf") {
                  let result = await convertapi.convert(
                    "pdf",
                    filetype_settings(file_path, file_ext),
                    file_ext.substring(1)
                  );
                  //over-write original file declaration
                  var pdf_path = files[i].url?.includes("google")
                    ? `./uploads/${files[i].name}.pdf`
                    : `./uploads/${files[i].filename}.pdf`;
                  var file_to_pdf = await result.file.save(pdf_path);
                }
                file_to_pdf = fs.readFileSync(file_to_pdf);

                var watermarked_pdf = await create_watermark(
                  file_to_pdf,
                  files[i]
                );

                fs.writeFileSync(watermark_pdf_filepath, watermarked_pdf);
              } catch (err) {
                throw err;
              }
            }

            // await result of async operation
            await convert_to_pdf_and_watermark();

            //save watermarked PDF/IMG to s3, other pdf is discarded
            var s3PDFData = await s3
              .upload({
                Bucket: "texas-math-central",
                Key: watermark_pdf_key,
                Body: fs.readFileSync(watermark_pdf_filepath),
              })
              .promise();

            files[i].previewLink = s3PDFData.Location;
          }

          //save original file to s3
          let s3Data = await s3.upload(params).promise();
          files[i].s3Object = s3Data;
          files[i].s3Link = s3Data.Location;
        }

        resourceQueries.updateResourceWithFiles(
          resource._id,
          files,
          (err, update) => {
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
  async edit(req, res, next) {
    resourceQueries.getResource(req.params.resourceId, (err, resource) => {
      try {
        res.send(resource);
      } catch (err) {
        res.send(err);
      }
    });
  },
  async update(req, res, next) {
    resourceQueries.updateResource(
      req.params.resourceId,
      req.body,
      (err, resource) => {
        try {
          res.send(resource);
        } catch (err) {
          res.send(err);
        }
      }
    );
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
