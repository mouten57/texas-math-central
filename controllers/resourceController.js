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

  create(req, res) {
    resourceQueries.createResource(req, (err, reqFile) => {
      res.send(reqFile);
    });
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
    resourceQueries.getResource(req.params.resourceId, (err, resource) => {
      if (err || resource == null) {
        res.redirect(404, "/");
      } else {
        fs.writeFileSync(resource.file.path, resource.file_data, "binary");
        var data = fs.readFileSync(resource.file.path);

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
