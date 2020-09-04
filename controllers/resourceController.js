const resourceQueries = require("../db/queries.resources");
const unitFields = require("../helpers/unitFields");
const fs = require("fs");
var AWS = require("aws-sdk");
const keys = require("../config/keys/keys");
const deleteUploads = require("../middlewares/deleteUploads");

var s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  accessKeyId: keys.AWS_ACCESS_KEY,
  secretAccessKey: keys.AWS_SECRET_ACCESS_KEY,
});

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
    console.log("in create");
    global.createController = "started";
    let files = global.files || [];
    var newResource;
    const link = req.body.link;

    var files_plus_data = [...files];

    for (let i = 0; i < files.length; i++) {
      const params = {
        Bucket: "texas-math-central",
        Key: files[i].filename,
        Body: fs.readFileSync(`./uploads/${files[i].filename}`),
      };
      let s3Data = await s3.upload(params).promise();

      files_plus_data[i].s3Object = s3Data;
      files_plus_data[i].s3Link = s3Data.Location;
    }

    var newResource = {
      name: req.body.name,
      unit: req.body.unit,
      fullUnit: fullUnit(req.body.unit),
      type: req.body.type,
      link,
      description: req.body.description,
      _user: req.user._id,
      created_at: Date.now(),
      files: files_plus_data,
    };
    resourceQueries.addResource(newResource, (err, resource) => {
      if (err) {
        res.send(err);
      } else {
        global.files = null;
        global.createController = "finished";
        res.send(resource);
        //delete files from Upload dir
        deleteUploads();
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
