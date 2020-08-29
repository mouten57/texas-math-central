const resourceQueries = require("../db/queries.resources");
const unitFields = require("../helpers/unitFields");
const fs = require("fs");
const convertTimeStamp = require("../helpers/convertTimeStamp");
const s3 = require("../config/aws-config");

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

  create(req, res, next) {
    console.log("Req fileS in create", req.files);
    const link = req.body.link.includes("http")
      ? req.body.link
      : `//${req.body.link}`;
    if (req.files !== undefined) {
      let newResource = {
        name: req.body.name,
        unit: req.body.unit,
        fullUnit: fullUnit(req.body.unit),
        type: req.body.type,
        link,
        description: req.body.description,
        _user: req.user,
        created: Date.now(),
        files: req.files,
        file_data: (function () {
          var data = [];
          for (let i = 0; i < req.files.length; i++) {
            data.push(fs.readFileSync(`./uploads/${req.files[i].filename}`));
          }
          return data;
        })(),
        // s3Object: data,
        // s3Link: data.Location,
      };

      resourceQueries.addResource(newResource, (err, resource) => {
        if (err) {
          console.log(err);
        } else {
          res.send(resource);
        }
      });
      //delete upload
      if (req.files !== undefined) {
        for (let i = 0; i < req.files.length; i++) {
          fs.unlink(req.files[i].path, (err) => {
            if (err) throw err;
            console.log(`${req.files[i].originalname} was deleted.`);
          });
        }
      }
    } else {
      //no file. there has to be a better way to do this
      let newResource = {
        name: req.body.name,
        unit: req.body.unit,
        fullUnit: fullUnit(req.body.unit),
        type: req.body.type,
        link,
        description: req.body.description,
        _user: req.user,
        created: Date.now(),
      };
      resourceQueries.addResource(newResource, (err, resource) => {
        if (err) {
          console.log(err);
        } else {
          res.send(resource);
        }
      });
    }
  },
  destroy(req, res, next) {
    resourceQueries.destroyResource(req.params.resourceId, (err, result) => {
      if (err || result == null) {
        res.redirect(500, `/units/${req.params.unit}/${req.params.resourceId}`);
      } else {
        res.redirect(303, `/units/${req.params.unit}`);
      }
    });
  },
  download(req, res, next) {
    resourceQueries.getResource(req.params.resourceId, (err, result) => {
      const { resource, comments } = result;
      console.log("in download", resource);
      if (err || resource == null) {
        res.redirect(404, "/");
      } else {
        let correct_file = resource.files.filter((obj) => {
          return obj.originalname == req.params.filename;
        })[0];

        fs.writeFileSync(correct_file.path, correct_file.filename, "binary");

        res.download(`./${correct_file.path}`, (err) => {
          if (err) {
            console.log(err);
          } else {
            //need to delete file after download is complete
            fs.unlink(correct_file.path, (err) => {
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
