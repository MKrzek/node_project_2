const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressHbs = require('express-handlebars');
const { adminRouter } = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.engine(
  'handlebars',
  expressHbs({
    defaultLayout: 'main',
    extname: 'handlebars',
  })
);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouter);
app.use(shopRoutes);

app.use((req, res) => {
  res.status(404).render('page-not-found', { pageTitle: 'Page not found' });
});

app.listen(3000, () => {
  console.log('server running');
});
