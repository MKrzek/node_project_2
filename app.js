const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');
const csrf = require('csurf');
const flash = require('connect-flash');
const expressHbs = require('express-handlebars');
const helpers = require('handlebars-helpers');

const User = require('./models/user');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const { get404, get500 } = require('./controllers/error');

const MONGODB_URI =
  'mongodb+srv://mkrzek:mkrzek@node-app-vgofl.mongodb.net/test?retryWrites=true&w=majority';

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const csrfProtection = csrf();

app.engine(
  'handlebars',
  expressHbs({
    helpers: helpers(),
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true,
    defaultLayout: 'main',
    extname: 'handlebars',
  })
);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  session({ secret: '34d3s', resave: false, saveUninitialized: false, store })
);

app.use(csrfProtection);

app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();

  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.get('/500', get500);

app.use(get404);
app.use((error, req, res, next) => {
  console.log('err', error);
  res.status(500).render('/500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
  });
});

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
