var answerModel =  require('../models/answer');
var questionModel =  require('../models/question');
var config = require('../config/config');
var jwt = require('jsonwebtoken');
var QandA = {
              addAnswer: function(req,res) {
                console.log("************************************")
                console.log("this is create method");
                console.log("************************************")

                var answer =  new answerModel();
                answer.Answer = req.body.Answer;
                answer.Username = req.body.Username;
                answer.QuestionID = req.body.QuestionID;
                answer.DateString = req.body.DateString;
                answer.likesCount = req.body.likesCount;


                var docx = {
                  Answer : req.body.Answer,
                  Username : req.body.Username,
                  QuestionID : req.body.QuestionID,
                  DateString : req.body.DateString,
                  likesCount : req.body.likesCount
                  };
                  console.log('this is docx',docx)

                answer.save(function(err){
                  var docs = {};
                  if(err) {
                    res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
                  }
                  else {
                    res.status(200).json({status:'success', message: 'Added to Mongo successfully', docs: docx });
                  }

                });


              },
              addQuestion: function(req,res) {
                    var user;
                    var question =  new questionModel();
                    console.log("************************************")
                    console.log("this is create method");
                    console.log("************************************")
                    var decode = jwt.decode(req.body.token,config.secretKey)
                    console.log("this is inside addQuestion",decode)

                    if(decode.hasOwnProperty('Username')){
                      question.Username = decode.Username;
                      user = decode.Username;
                      console.log("************************",decode.Username)
                    }
                    else if(decode.hasOwnProperty('Id'))
                    {
                      question.Username = decode.Id;
                      user = decode.Id;
                      console.log("************************",decode.Id)
                    }

                    question.Title = req.body.Title;
                    question.Description = req.body.Description;
                    question.Tags = req.body.Tags;
                    question.DateString = req.body.DateString;
                    question.Username = user;


                    var docx = {
                        Title : req.body.Title,
                        Description : req.body.Description,
                        Tags : req.body.Tags,
                        Username : "user",
                        DateString : req.body.DateString
                      };
                      console.log(question)

                    question.save(function(err){
                      var docs = {};
                      if(err) {
                        res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
                      }
                      else {
                        res.status(200).json({status:'success', message: 'Added to Mongo successfully', docs: docx });
                      }
                    });

              },
              getQuestions: function(req,res) {
                questionModel.find(function(err, docs){
                  if(err) {
                    res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
                  }
                  else {
                    res.status(200).json({status:'success', message: 'Success', docs: docs });
                  }
                });
              },
              getQuestion: function(req,res){
                questionModel.findOne({
                  $and:[
                    {'_id':req.body.Id }
                  ]
                }, function(err, user){

                  if(err || !user) {
                    res.status(400).json({status:'error', message: 'Bad Request, token not valid'  });
                  }
                  else {
                    console.log("*************************************************************\nuser passed");
                    res.status(200).json({status:'success', message: 'Success', docs: user });
                  }
                });
              },
              getAnswers: function(req,res){

                answerModel.find({
                    "QuestionID": req.body.QuestionID
                  },function(err,docs){
                    if(err) {
                      res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
                    }
                    else {
                      res.status(200).json({status:'success', message: 'Success', docs: docs });
                    }

                  });


              },
              incrementLikeCount: function(req,res) {

                answerModel.find({
                  "_id": req.body.AnswerID
                },function(err,answer){
                  if(err){
                      res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
                  }
                  else {
                    console.log(answer[0])

                    var newCount = answer[0].likesCount + 1;
                    console.log(newCount)
                    if(newCount>0) {
                    answerModel.updateOne(
                       { _id: req.body.AnswerID },
                       { $set:
                          {
                            likesCount:newCount
                          }
                       },
                       function(err,answer){
                         if(err){
                            res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
                         }
                         else {
                           console.log('increment done')
                           res.status(200).json({status:'success', message: 'Success', docs: {status:true} });
                         }
                       }
                      )
                    }

                  }
                });


              },
              decrementLikeCount: function(req,res) {


                answerModel.find({
                  "_id": req.body.AnswerID
                },function(err,answer){
                  if(err){
                      res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
                  }
                  else {
                    var newCount = answer[0].likesCount - 1;
                    if(newCount<0){ newCount=0 }
                    answerModel.updateOne(
                       { _id: req.body.AnswerID },
                       { $set:
                          {
                            likesCount:newCount
                          }
                       },
                       function(err,answer){
                         if(err){
                            res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
                         }
                         else {
                           console.log('increment done')
                           res.status(200).json({status:'success', message: 'Success', docs: {status:true} });
                         }
                       }
                      )


                  }
                });
              },

              getTags: function(req,res){
                      questionModel.find(function(err,docs){
                            if(err){
                                res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
                            }
                            else {
                                var data = getTagArray(docs);
                                res.status(200).json({status:'success', message: 'Success', docs: data });
                            }
                      });
              },
              getTaggedQuestions: function(req,res){
                console.log("this is getTaggedQuestions")
                        questionModel.find(function(err,docs){
                          if(err){
                              res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
                          }
                          else {
                            var data = getQuestions(req.body.Tag,docs);
                            console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                            console.log(data)
                            res.status(200).json({status:'success', message: 'Success', docs: data });
                          }
                        });
              }
              };
var getTagArray = function(docs) {
    var data = new Array();
    for(var i=0;i<docs.length;i++){
      data = data.concat(docs[i].Tags)
    }
    return data;

}

var getQuestions = function(tag,docs){
  var data = new Array();
  var j=0;
  for(var i=0;i<docs.length;i++){
    console.log(docs[i].Tags+" includes"+tag)
    console.log()
    if(docs[i].Tags.includes(tag)) {
      data[j] = docs[i];
      j++;
    }
    else {
      continue;
    }
  }
  return data;

}

module.exports = QandA;
  
