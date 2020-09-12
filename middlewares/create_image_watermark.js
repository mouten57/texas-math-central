const Jimp = require("jimp");

module.exports = function (ORIGINAL_IMAGE, LOGO, FILE_NAME, CB) {
  ORIGINAL_IMAGE = ORIGINAL_IMAGE.path;
  const LOGO_MARGIN_PERCENTAGE = 5;

  const main = async () => {
    const [image, logo] = await Promise.all([
      Jimp.read(ORIGINAL_IMAGE),
      Jimp.read(LOGO),
    ]);

    logo.resize(image.bitmap.width, Jimp.AUTO);

    const xMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
    const yMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;

    const X = image.bitmap.width - logo.bitmap.width - xMargin;
    const Y = image.bitmap.height - logo.bitmap.height - yMargin;

    return image.composite(logo, X, Y, [
      {
        mode: Jimp.BLEND_SCREEN,
        opacitySource: 0.1,
        opacityDest: 1,
      },
    ]);
  };

  main()
    .then((image) => {
      image.write(FILE_NAME);
    })
    .then((data) => CB(null, data))
    .catch((err) => {
      throw err;
    });
};
