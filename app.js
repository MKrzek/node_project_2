const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');

const expressHbs = require('express-handlebars');
const User = require('./models/user');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const get404 = require('./controllers/error');

const MONGODB_URI =
  'mongodb+srv://mkrzek:mkrzek@node-app-vgofl.mongodb.net/test?retryWrites=true&w=majority';

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});
const csrfProtection = csrf();

app.engine(
  'handlebars',
  expressHbs({
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true,
    defaultLayout: 'main',
    extname: 'handlebars',
  })
);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({ secret: '34d3s', resave: false, saveUninitialized: false, store })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(get404);

// mongoConnect(() => {
//   console.log('mongoClient');
//   app.listen(3000, () => {
//     console.log('server running');
//   });
// });

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('mongoose-working');

    app.listen(3000, () => {
      console.log('server running');
    });
  })
  .catch(err => console.log('err-connection', err));
