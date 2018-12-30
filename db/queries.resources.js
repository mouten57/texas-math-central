const mongoose = require('mongoose');
const Resource = mongoose.model('resources');
const fs = require('fs');

module.exports = {
  getAllResources(callback) {
    //get all resources, EXCEPT for the file data
    //..was TOO slow to load. Need to set up so if they want it,
    //they should click a download button to get it.

    return Resource.find({}, { file_data: 0 }).then(resources => {
      callback(null, resources);
    });
  },
  createResource(req, callback) {
    if (req.body.imageFile === '') {
      const resource = new Resource({
        name: req.body.name,
        unit: req.body.unit,
        type: req.body.type,
        link: req.body.link,
        description: req.body.description,
        _user: req.user, //saves entire user profile so we can access name, nickname, photo easily on comment form
        dateSent: Date.now()
      });
      resource.save().catch(err => callback(err));
    } else {
      const resource = new Resource({
        name: req.body.name,
        unit: req.body.unit,
        type: req.body.type,
        link: req.body.link,
        description: req.body.description,
        _user: req.user, //see above comment
        dateSent: Date.now(),
        file_name: req.file.originalname,
        file_type: req.file.mimetype,
        file_path: req.file.path,
        file_data: fs.readFileSync('./src/uploads/output.jpg')
      });

      resource
        .save()
        .then(() => {
          console.log(`${resource.name} saved to collection.`);
        })
        .then(() => {
          fs.unlink(`./src/uploads/${req.file.filename}`, err => {
            if (err) {
              console.log('Failed to delete local image:' + err);
            } else {
              console.log(
                `Successfully deleted ${resource.name} from local storage.`
              );
            }
          });
        })
        .then(() => {
          fs.unlink(`./src/uploads/output.jpg`, err => {
            if (err) {
              console.log('Failed to delete local image:' + err);
            } else {
              console.log(
                `Successfully deleted output.jpg from local storage.`
              );
            }
          });
        })
        .catch(err => callback(err));
    }
    callback(null, req.file);
  },
  getResource(id, callback) {
    return (
      Resource.find({ _id: id })
        //need to get matching comments, here as well
        .then(resource => {
          callback(null, resource);
        })

        .catch(err => {
          callback(err);
        })
    );
  }
};
