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
    console.log("Req file in create", req.file);
    const link = req.body.link.includes("http")
      ? req.body.link
      : `//${req.body.link}`;
    if (req.file !== undefined) {
      s3.upload(req.file, (err, data) => {
        console.log(data);
        let newResource = {
          name: req.body.name,
          unit: req.body.unit,
          fullUnit: fullUnit(req.body.unit),
          type: req.body.type,
          link,
          description: req.body.description,
          _user: req.user,
          created: Date.now(),
          file: req.file,
          file_data: fs.readFileSync(`./uploads/${req.file.filename}`),
          s3Object: data,
          s3Link: data.Location,
        };

        resourceQueries.addResource(newResource, (err, resource) => {
          if (err) {
            console.log(err);
          } else {
            res.send(resource);
          }
        });
        //delete upload
        if (req.file !== undefined) {
          fs.unlink(req.file.path, (err) => {
            if (err) throw err;
            console.log(`${req.file.originalname} was deleted.`);
          });
        }
      });
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
        fs.writeFileSync(resource.file.path, resource.file_data, "binary");

        res.download(`./${resource.file.path}`, (err) => {
          if (err) {
            console.log(err);
          } else {
            //need to delete file after download is complete
            fs.unlink(resource.file.path, (err) => {
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
