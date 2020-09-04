const filepreview = require("./filepreview.js");
const fs = require("fs");
const path = require("path");
const unoconv = require("awesome-unoconv");
var im = require("imagemagick");

const sourceFilePath = path.resolve("./documents/example.xlsx");
const outputFilePath = path.resolve("./documents/example.pdf");

unoconv
  .convert(sourceFilePath, outputFilePath)
  .then((result) => {
    im.convert(
      [
        "-flatten",
        "-background",
        "#fff",
        "-quality",
        100,
        "-resize",
        "500x800",
        "/Users/matt.outen/Desktop/projects/texas-math-central/middlewares/filepreview/documents/example.pdf",
        "/Users/matt.outen/Desktop/projects/texas-math-central/middlewares/filepreview/documents/example-widthxheight.jpg",
      ],
      function (err, stdout) {
        if (err) throw err;
        console.log("stdout:", stdout);
      }
    );
    console.log(result); // return outputFilePath
  })
  .catch((err) => {
    console.log(err);
  });

// const fileName = "example.xlsx";
// const filePath = path.resolve("documents", fileName);
// const options = {
//   width: 800,
//   height: 1100,
//   quality: 100,
//   background: "#fff",
//   pdf: true,
//   keepAspect: true,
//   pagerange: "1",
//   pdf_path: path.resolve("documents", "pdfs"),
// };
// const outPath = path.resolve(
//   "documents",
//   `${fileName.replace(/\.[^/.]+$/, "")}-widthxheight.jpg`
// );
// filepreview
//   .generateAsync(filePath, outPath, options)
//   .then((response) => {
//     //console.log(response);
//     console.log(response);
//   })
//   .catch((error) => console.log(error));
