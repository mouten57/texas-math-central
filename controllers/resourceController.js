const resourceQueries = require("../db/queries.resources");
const resourceViewsQueries = require("../db/queries.resource_views");
const unitFields = require("../helpers/unitFields");
const fs = require("fs");
var AWS = require("aws-sdk");
const awsConfig = require("../config/aws-config");
const keys = require("../config/keys/keys");
const deleteUploads = require("../middlewares/deleteUploads");
var { s3 } = awsConfig;
var convertapi = require("convertapi")(keys.convertapi_KEY);
const path = require("path");
const filetype_settings = require("../helpers/filetype_settings");
const { create_watermark } = require("../middlewares/create_watermark");
const driveDownload = require("../middlewares/driveDownload");
const { createThumbnail } = require("../helpers/GetThumbnail/getThumbnail.js");

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
        // quickSave(resource.)

        res.send(resource);
      }
    });
  },
  increaseViewCount(req, res, next) {
    resourceViewsQueries.increaseViewCount(
      req.params.resourceId,
      (err, count) => {
        if (err) {
          res.status(422).send(err);
        } else {
          res.send(count);
        }
      }
    );
  },
  getDriveFiles(req, res, next) {
    //sending entire file (just the first one)
    driveDownload(
      req.body.docs,
      req.session.drive_auth,
      (err, filePathList) => {
        if (err) {
          return res.send(err);
        } else {
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

    resourceQueries.addResource(newResource, async (err, resource) => {
      if (err) {
        res.send(err);
      } else {
        res.send(resource);
        //after sending initial, send files
        //start upload with aws
        for (let i = 0; i < files.length; i++) {
          // set all vars together
          console.log(files[i]);
          var root_folder = "./uploads",
            file_name = files[i].name || files[i].filename,
            file_path = files[i].path || parsed_googleFileDownloads[i],
            file_ext = path.extname(file_path).toLowerCase(),
            stripped_file_name = path.basename(file_name, file_ext),
            pdf_or_no = file_ext == ".pdf" ? "" : ".pdf",
            name_plus_ext = `${stripped_file_name}${file_ext}`,
            Key = name_plus_ext,
            Body = fs.readFileSync(file_path),
            thumbnail_key = `${stripped_file_name}_thumbnail.png`,
            thumbnail_path = `${root_folder}/${stripped_file_name}_thumbnail.png`,
            file_to_pdf = file_path,
            Bucket = "texas-math-central",
            image_types = ".jpg,.jpeg,.png,.bmp,.gif",
            watermark_pdf_key,
            watermark_pdf_filepath,
            pdf_key,
            pdf_path;

          console.log(
            path.extname(file_name),
            `file_name: ${file_name}
            stripped_file_name: ${stripped_file_name}
            file_path: ${file_path}
            file_to_pdf: ${file_to_pdf}
            file_ext:${file_ext},
            name_plus_ext: ${name_plus_ext}
            Key: ${Key}`
          );

          //only kick off conversion process if NOT an image
          // if (!files[i].mimetype.includes("image")) {
          if (!image_types.includes(file_ext)) {
            pdf_path = `${root_folder}/${file_name}${pdf_or_no}`;
            pdf_key = `${name_plus_ext}${pdf_or_no}`;
            async function convert_to_pdf_and_watermark() {
              //if file is NOT PDF, convert it to PDF
              if (file_ext != ".pdf") {
                let result = await convertapi.convert(
                  "pdf",
                  filetype_settings.convertApiParams(file_path, file_ext),
                  file_ext.substring(1)
                );
                console.log(`RESULT FROM PDF CONVERT:`, result.file);
                await result.file.save(pdf_path);
                file_to_pdf = pdf_path;
                console.log("IN THEN STATEMENT");
              }

              try {
                watermark_pdf_filepath = file_path.replace(
                  file_ext,
                  `_watermark${file_ext}${pdf_or_no}`
                );
                watermark_pdf_key = name_plus_ext.replace(
                  file_ext,
                  `_watermark${file_ext}${pdf_or_no}`
                );

                //load file from convertAPI
                var saved_file_from_convert_api = fs.readFileSync(file_to_pdf);
                var watermarked_pdf = await create_watermark(
                  saved_file_from_convert_api
                );

                fs.writeFileSync(watermark_pdf_filepath, watermarked_pdf);
              } catch (err) {
                console.log(err);

                //if we error out with bad pdf for watermark, can we just use the non-watermarked file instead?
                //we'll use the first file we got page...1 pager from convertapi
              }
              try {
                //create thumbnail
                await createThumbnail(
                  file_to_pdf,
                  thumbnail_path,
                  (err, res) => {
                    if (err) throw err;
                    console.log(res);
                  }
                );
              } catch (err) {
                res.send(err);
              }
            }

            // await result of async operation
            await convert_to_pdf_and_watermark();

            //save thumbnail to s3
            var s3ThumbnailData = await s3
              .upload({
                Bucket,
                Key: thumbnail_key,
                Body: fs.createReadStream(thumbnail_path),
              })
              .promise();
            files[i].s3ThumbnailLink = s3ThumbnailData.Location;

            //save watermarked PDF/IMG to s3
            var s3PDFData = await s3
              .upload({
                Bucket,
                Key: `${watermark_pdf_key || pdf_key}`,
                Body: fs.createReadStream(
                  `${watermark_pdf_filepath || pdf_path}`
                ),
              })
              .promise();

            files[i].previewLink = s3PDFData.Location;
            console.log(s3PDFData);
          }

          //save original file to s3
          let s3Data = await s3
            .upload({
              Bucket,
              Key: watermark_pdf_key || pdf_key || file_name,
              Body: fs.createReadStream(
                watermark_pdf_filepath || pdf_path || file_path
              ),
            })
            .promise();
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
