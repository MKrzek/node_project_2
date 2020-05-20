const get404 = (req, res) => {
  res.status(404).render('404', {
    path: '/404',
    pageTitle: 'Page not found',
    isAuthenticated: req.session.isLoggedIn,
  });
};
const get500 = (req, res) => {
  res.status(500).render('500', {
    path: '/500',
    pageTitle: 'Page not found',
    isAuthenticated: req.session.isLoggedIn,
  });
};
module.exports = { get404, get500 };
