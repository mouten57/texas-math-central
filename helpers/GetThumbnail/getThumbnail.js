// var Promise = require("bluebird");
// const gm = require("gm").subClass({ imageMagick: true });
// Promise.promisifyAll(gm.prototype);

const pdf = require("pdf-thumbnail");
const fs = require("fs");

module.exports = {
  // createThumbnail: async function (pdfPath, save_path, cb) {
  //   //Create JPG from page 0 of the PDF
  //   await gm(`${pdfPath}[0]`) // The name of your pdf
  //     .setFormat("jpg")
  //     .resize(200) // Resize to fixed 200px width, maintaining aspect ratio
  //     .quality(75) // Quality from 0 to 100
  //     .writeAsync(save_path)
  //     .then((res) => {
  //       cb(null, res);
  //     })
  //     .catch((err) => {
  //       cb(err);
  //     });
  createThumbnail: function (pdfPath, save_path, cb) {
    console.log(`pdf path is ${pdfPath}
    save_path is ${save_path}
    `);
    const pdfBuffer = fs.readFileSync(pdfPath);
    pdf(pdfBuffer, {
      resize: {
        width: 200, //default
        height: 200, //default
      },
    })
      .then((data) => {
        const stream = data.pipe(fs.createWriteStream(save_path));
        stream.on("finish", () => {
          cb(null, "SUCCESS");
        });

        stream.on("error", (err) => cb(err)); // or something like that. might need to close `hash`
      })

      .catch((err) => console.log(err));
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
