var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var googleUser =  new Schema({
  Email: String,
  Id: String,
  IdToken: String,
  Image: String,
  Name: String,
  Provider: String,
  Token: String,
  LikedAnswers:[String]
});

module.exports = mongoose.model('googleUser', googleUser);
