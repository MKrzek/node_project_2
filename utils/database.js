const mongodb = require('mongodb');

const { MongoClient } = mongodb;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    'mongodb+srv://mkrzek:mkrzek@node-app-vgofl.mongodb.net/test?retryWrites=true&w=majority',
    { useUnifiedTopology: true }
  )
    .then(client => {
      console.log('connected', client);
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log('err', err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No DB found';
};
module.exports = { mongoConnect, getDb };
