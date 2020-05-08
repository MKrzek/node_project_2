const get404 = (req, res) => {
  res.status(404).render('page-not-found', { pageTitle: 'Page not found' });
};
module.exports = get404;
