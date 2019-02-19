var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user =  new Schema({
  Email:String,
  Username:String,
  Password:String,
  LikedAnswers:[String]
});

module.exports = mongoose.model('user', user);
