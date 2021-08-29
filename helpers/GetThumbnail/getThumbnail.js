var Promise = require("bluebird");
const gm = require("gm").subClass({ imageMagick: true });
Promise.promisifyAll(gm.prototype);

module.exports = {
  createThumbnail: async function (pdfPath, save_path, cb) {
    //Create JPG from page 0 of the PDF
    await gm(`${pdfPath}[0]`) // The name of your pdf
      .setFormat("jpg")
      .resize(200) // Resize to fixed 200px width, maintaining aspect ratio
      .quality(75) // Quality from 0 to 100
      .writeAsync(save_path)
      .then((res) => {
        cb(null, res);
      })
      .catch((err) => {
        cb(err);
      });
  },
};

// Create a PNG using thumbnail function
// module.exports = {
//   createThumbnail: function (pdfPath, save_path, cb) {
//     gm(`${pdfPath}[0]`).thumb(
//       200, // Width
//       200, // Height
//       save_path, // Output file name
//       80, // Quality from 0 to 100
//       function (error, stdout, stderr, command) {
//         if (!error) {
//           console.log(command);
//         } else {
//           console.log(error);
//         }
//       }
//     );
//     try {
//       cb(result);
//     } catch (err) {
//       console.log(err);
//     }
//   },
// };
