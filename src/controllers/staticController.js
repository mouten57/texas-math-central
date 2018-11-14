module.exports = {
  index(req, res, next) {
    res.render('static/index', { title: 'Texas Math Central' });
  },
  about(req, res, next) {
    res.render('static/about', {});
  }
};
