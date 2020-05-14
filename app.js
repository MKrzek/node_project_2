const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const expressHbs = require('express-handlebars');
const User = require('./models/user');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const get404 = require('./controllers/error');

const { mongoConnect } = require('./utils/database');

const app = express();

app.engine(
  'handlebars',
  expressHbs({
    defaultLayout: 'main',
    extname: 'handlebars',
  })
);
app.set('view engine', 'handlebars');
// app.use((req, res, next) => {
//   User.findById('5ebbeda0c8acc0379e6b0d1e')
//     .then(user => {
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       next();
//     })
//     .catch(err => console.log('user-loggin-err', err));
// });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

// mongoConnect(() => {
//   console.log('mongoClient');
//   app.listen(3000, () => {
//     console.log('server running');
//   });
// });

mongoose
  .connect(
    'mongodb+srv://mkrzek:mkrzek@node-app-vgofl.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true }
  )
  .then(result => {
    console.log('mongoose', result);
    app.listen(3000, () => {
      console.log('server running');
    });
  })
  .catch(err => console.log('err', err));
