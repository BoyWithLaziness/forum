var googleUserModel =  require('../models/googleUser');
var config = require('../config/config');
var jwt = require('jsonwebtoken');
var fs = require('fs');

//GLOBALS
loginStatus = false;
uniqueOrNot = false;
global_path_file = null ;
global_username = null ;
global_isLogin = null;



var googleUsers  = {
                    getUser : function(req,res){
                      var decode = jwt.decode(req.body.token,config.secretKey);
                      console.log(req.body);
                      googleUserModel.find({ "Id": decode.Id},function(err, docs){
                        if(err){
                          res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
                        }
                        else {
                          console.log(docs)
                          res.status(200).json({status:'success', message: 'Success', docs: docs });
                        }
                      });

                    },
                    googleLogin: function(req,res){
                      console.log("this is inside checkCredentials js function",req.body);
                      googleUserModel.find(function(err, docs){
                        if(err) {
                          res.status(500).json({status:false, message: 'Datebase Error:' + err , docs:''});
                        }
                        else {
                          loginStatus = checkCredentialsInDb(req.body,docs);
                          if(loginStatus) {

                            var token = jwt.sign({ Id: req.body.Id }, config.secretKey);
                            var data = {
                                  status:loginStatus,
                                  token:token
                            }
                            console.log("Success in login here is the data")
                            console.log(data);
                          res.status(200).json({status:'success', username: req.body.username, docs: data });
                        }
                        else {
                          res.status(200).json({status:'not success', username: req.body.username, docs: {status:false} });
                        }
                        }
                      });


                    },
                    googleUserExists: function(req,res){
                      googleUserModel.find(function(err, docs){
                        if(err) {
                          res.status(500).json({status:false, message: 'Datebase Error:' + err , docs:''});
                        }
                        else {
                          loginStatus = checkCredentialsInDb(req.body,docs);
                          if(loginStatus) {
                            res.status(200).json({status:'success', username: req.body.username, docs: {status:true} });
                          }
                          else {
                            res.status(200).json({status:'not success', username: req.body.username, docs: {status:false} });
                          }
                        }
                      });

                    },
                    googleCreate: function(req,res){

                      console.log("************************************")
                      console.log("this is google create method");
                      console.log("************************************")

                      var googleUser =  new googleUserModel();
                      googleUser.Email = req.body.Email;
                      googleUser.Id = req.body.Id;
                      googleUser.IdToken = req.body.IdToken;
                      googleUser.Image = req.body.Image;
                      googleUser.Name = req.body.Name;
                      googleUser.Provider = req.body.Provider;
                      googleUser.Token = req.body.Token;
                      googleUser.AnswersLiked = req.body.AnswersLiked;

                      var docx = {
                        Email : req.body.Email,
                        Id : req.body.Id,
                        IdToken : req.body.IdToken,
                        Image : req.body.Image,
                        Name : req.body.Name,
                        Provider : req.body.Provider,
                        Token : req.body.Token,
                        AnswersLiked :  req.body.AnswersLiked
                        };
                        console.log(docx)
                      config.username = docx.Username;

                      googleUser.save(function(err){
                        var docs = {};
                        if(err) {
                          res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
                        }
                        else {
                          res.status(200).json({status:'success', message: 'Added to Mongo successfully', docs: docx });
                        }

                      });

                    },
                    getUsers: function(req,res){
                      googleUserModel.find(function(err, docs){
                        if(err) {
                          res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
                        }
                        else {
                          res.status(200).json({status:'success', message: 'Success', docs: docs });
                        }
                      });
                    },

                    getGoogleUserName: function(req,res){
                      googleUserModel.findOne({"Id":req.body.Id}, function(err, user){
                        if(err){
                          res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
                        }
                        else {
                          console.log("afasdadsasad",user,req.body.Id)
                          var data = {Name: user.Name};
                          res.status(200).json({status:'success', message: 'Success', docs: data });
                        }
                      });
                    }

};

var checkCredentialsInDb = function(data,docs) {
  console.log("this is inside checkCredentialsInDb js function",data);
  for(var i=0;i<docs.length;i++){
    console.log(data.Id +"==="+ docs[i].Id);
    if(data.Id == docs[i].Id) {
      console.log("Credentials correct")
      return true;
    }
    else {
      console.log("Credentials incorrect")
      continue ;
    }
  }
  return false;
}


module.exports = googleUsers;
