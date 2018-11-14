module.exports = app => {
  app.get('/api/image', (req, res) => {
    return res.sendFile(
      '/Users/mouten57/side-projects/texas-math-central/src/assets/images/logo.jpg'
    );
  });
};
