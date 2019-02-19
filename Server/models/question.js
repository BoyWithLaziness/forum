var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var question =  new Schema({
Title: String,
Description:String,
Tags:[String],
Username:String,
DateString: String

});

module.exports = mongoose.model('question', question);
