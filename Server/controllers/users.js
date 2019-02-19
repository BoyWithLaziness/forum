var googleUserModel =  require('../models/googleUser');
var userModel =  require('../models/user');
var config = require('../config/config');
var jwt = require('jsonwebtoken');
var fs = require('fs');

//GLOBALS
loginStatus = false;
uniqueOrNot = false;
global_path_file = null ;
global_username = null ;
global_isLogin = null;



var users  = {
  //check server working or not, get response
  show: function(req, res) {
    res.status(200).json({status:'success', message: 'Success'});
  },

  //get all users from users collection in DB
  getUsers: function(req,res) {
    userModel.find(function(err, docs){
      if(err) {
        res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
      }
      else {
        res.status(200).json({status:'success', message: 'Success', docs: docs });
      }
    });

  },
  //get singler user from usersInfo collection from DB, using username
  getUser: function(req,res) {
    console.log(req.body);
    userModel.find({ "Username": req.body.Username},function(err, docs){
      if(err){
        res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
      }
      else {
        console.log(docs)
        res.status(200).json({status:'success', message: 'Success', docs: docs });
      }
    });
  },

  //create user in user collection in DB, with registeration data
  create: function(req, res) {

    console.log("************************************")
    console.log("this is create method");
    console.log("************************************")

    var user =  new userModel();
    user.Email = req.body.Email;
    user.Username = req.body.Username;
    user.Password = req.body.Password;
    user.LikedAnswers = req.body.LikedAnswers;

    var docx = {
      Email : req.body.Email,
      Username: req.body.Username,
      Password : req.body.Password,
      LikedAnswers: req.body.LikedAnswers
      };
      console.log(docx)
    config.username = docx.Username;

    user.save(function(err){
      var docs = {};
      if(err) {
        res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
      }
      else {
        res.status(200).json({status:'success', message: 'Added to Mongo successfully', docs: docx });
      }

    });
  },

  changeLikeStatus: function(req,res){

    var AnswerID = req.body.AnswerID;
    var decode = jwt.decode(req.body.token,config.secretKey);

    if(decode.hasOwnProperty('Username')){
      userModel.find({
          "Username": decode.Username
        },function(err,docs){
          if(err) {
            res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
          }
          else {
                  var user = docs[0];
                  console.log(docs)
                  if(user.LikedAnswers.includes(AnswerID)){
                    userModel.update(
                       { "Username": decode.Username },
                       { $pull:
                          {
                            "LikedAnswers": AnswerID
                          }
                       },
                       function(err,user){
                         if(err){
                            res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
                         }
                         else {
                           console.log(user)
                           res.status(200).json({status:'success', message: 'Removed from array', docs: {status: true} });
                           console.log('liked status added')

                         }
                       }
                      )

                  }
                  else {
                    userModel.update(
                       { "Username": decode.Username },
                       { $push:
                          {
                            "LikedAnswers": AnswerID
                          }
                       },
                       function(err,user){
                         if(err){
                            res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
                         }
                         else {
                           console.log(user)
                           res.status(200).json({status:'success', message: 'Added in array', docs: {status: true} });
                           console.log('liked status added')

                         }
                       }
                      )
                  }

                }

    })
    }
    else if(decode.hasOwnProperty('Id')){
      googleUserModel.find({
          "Id": decode.Id
        },function(err,docs){
          if(err) {
            res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
          }
          else {
                  var user = docs[0];
                  console.log(docs)
                  if(user.LikedAnswers.includes(AnswerID)){
                    googleUserModel.update(
                       { "Id": decode.Id },
                       { $pull:
                          {
                            "LikedAnswers": AnswerID
                          }
                       },
                       function(err,user){
                         if(err){
                            res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
                         }
                         else {
                           console.log(user)
                           res.status(200).json({status:'success', message: 'Removed from array', docs: {status: true} });
                           console.log('liked status popped')
                         }
                       }
                      )

                  }
                  else {
                    googleUserModel.update(
                       { "Id": decode.Id },
                       { $push:
                          {
                            "LikedAnswers": AnswerID
                          }
                       },
                       function(err,user){
                         if(err){
                            res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
                         }
                         else {
                           console.log(user)
                           res.status(200).json({status:'success', message: 'Added in array', docs: {status: true} });
                           console.log('liked status pushed')

                         }
                       }
                      )
                  }

                }

    })
    }

},
  //Check uniqueness of username and email in users, in DB
  isUnique : function(req, res) {

    userModel.find(function(err, docs){
      if(err) {
        res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
      }
      else {
        uniqueOrNot = checkInUsernameDb(req.body.Username,docs)
        if(uniqueOrNot) {
        res.status(200).json({status:'success', message: 'Success', docs: {status: true} });
      }
      else {
        res.status(200).json({status:'success', message: 'Success', docs: {status: false} });
      }
        }



    });
  },

  //check credentials from users collection in DB

  login: function(req, res) {
    console.log("this is inside checkCredentials js function",req.body);


    userModel.find(function(err, docs){
      if(err) {
        res.status(500).json({status:false, message: 'Datebase Error:' + err , docs:''});
      }
      else {
        loginStatus = checkCredentialsInDb(req.body,docs);
        if(loginStatus) {
          var token = jwt.sign({ Username: req.body.Username }, config.secretKey);
          var data = {
                status:loginStatus,
                token:token
          }
        res.status(200).json({status:'success', username: req.body.username, docs: data });
      }
      else {
        res.status(200).json({status:'not success', username: req.body.username, docs: {status:false} });
      }
      }
    });

  },

  //Check status of user is login or not
  //accordingly return status : true or false
  checkLogin: function(req,res) {
      console.log("this is checklogin");
      console.log("this is req");
      //console.log(req);

      //console.log(req.IncomingMessage);



      if(req.session.loginStatus) {
        console.log("login is still true");
        res.json({
          docs: {
          status:true,
          message:'yup still logged in',
          username: req.session.username
        }
        })
      }
      else {
        console.log("login is still false");
        res.json({
          docs: {
          status:false,
          message:'nope, not logged in'
        }
        })
      }

  },

  //logout happens here i.e. session is destroyed for the logged out user
  logout: function(req,res) {
      //global_isLogin = false;
      global_isLogin = false;
      global_isLogin = false;
      console.log("this is LOGOUT API");
      console.log("inside logout api");
      //console.log("logout clicked",req.session.loginStatus);
      res.json({
        docs: {
        status:false,
        message:'logout'
      }
      })
  },

  getTokenValue: function(req,res) {
            var tokenValue = jwt.decode(req.body.token,config.secretKey);
            console.log("this is get token value")
            console.log(tokenValue);
            if(tokenValue.hasOwnProperty('Username')){
            var name = tokenValue.Username;
            res.status(200).json({status:true, message:"we got the token value", docs:{Username:name}})
          }
          else if(tokenValue.hasOwnProperty('Id')){
            var Id = tokenValue.Id;
            res.status(200).json({status:true, message:"we got the token value", docs:{Id:Id}})

          }
  },

  isLiked: function(req,res){
        var AnswerID = req.body.AnswerID
        var decode = jwt.decode(req.body.token,config.secretKey);
        console.log(req.body)
        if(decode.hasOwnProperty('Username')){
        userModel.find({ "Username": decode.Username},function(err, docs){
              var user = docs[0];

              if(user.LikedAnswers.includes(AnswerID)){
                  res.status(200).json({status:true, message:"Answer already liked", docs:{status:true}})
              }
              else {
                  res.status(200).json({status:true, message:"Answer not liked", docs:{status:false}})
              }
            });
          }

          else if(decode.hasOwnProperty('Id')){

            googleUserModel.find({ "Username": decode.Username},function(err, docs){
                  var user = docs[0];
                  if(user.LikedAnswers.includes(AnswerID)){
                      res.status(200).json({status:true, message:"Answer already liked", docs:{status:true}})
                  }
                  else {
                      res.status(200).json({status:true, message:"Answer not liked", docs:{status:false}})
                  }

                });

          }
  }

};

// check uniqueness for username in users colletion
var checkInUsernameDb = function(value,docs) {
  for(var i=0;i<docs.length;i++){
    console.log(value+" == "+docs[i].Username);
    if(value === docs[i].Username) {
      console.log("Username correct")
      return true;
    }
    else {
      console.log("Username incorrect")
      continue;
    }
  }

}

//check uniqueness for email in users collection
var checkInEmailDb = function(value,docs) {
  for(var i=0;i<docs.length;i++){
    console.log(value+" == "+docs[i].Email);
    if(value === docs[i].Email) {
      console.log("Email correct")
      return true;
    }
    else {
      console.log("Email incorrect")
      continue;
    }
  }
}

//For login checking in DB is if user exists or not
var checkCredentialsInDb = function(data,docs) {
  console.log("this is inside checkCredentialsInDb js function",data);
  for(var i=0;i<docs.length;i++){
    console.log(data.Username +"==="+ docs[i].Username +"&&"+ data.Password +"==="+ docs[i].Password);
    if(data.Username == docs[i].Username && data.Password == docs[i].Password) {
      console.log("Credentials correct")
      return true;
    }
    else {
      console.log("Credentials incorrect")
      continue ;
    }
  }

}


module.exports = users;
