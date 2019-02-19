var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var answer =  new Schema({
Answer: String,
Username:String,
QuestionID:String,
DateString:String,
likesCount:Number
});

module.exports = mongoose.model('answer', answer);
