
var userModel = require('../models/user');
var googleUserModel = require('../models/googleUser');
var config = require('../config/config');
var jwt = require('jsonwebtoken');
//var validateUser = require('./middlewares').validateRequest;
var paths = [
            '/forum/login',
            '/forum/is_unique',
            '/forum/create_user',
            '/forum/show',
            '/forum/get_users',
            '/forum/check_login',
            '/forum/get_questions',
            '/forum/get_question',
            '/forum/get_answers',
            '/forum/get_tagged_questions',
            '/forum/google_create',
            '/forum/google_user_exists',
            '/forum/google_login',
            '/forum/google_users',
            '/forum/get_google_username'
          ];


      //paths[paths.length-1]=;
module.exports = function(req, res, next) {
  var requestPath = req.baseUrl
  console.log(requestPath);
  console.log("inside validateRequest");


  try {

    if(paths.includes(requestPath)){
      next();
    }

    else {

      var token = req.body.token || req.headers['token'];
      if(token) {
      var decode = jwt.decode(token, config.secretKey);

      if(decode.hasOwnProperty("Username")){
        userModel.findOne({
          $and:[
            {'Username':decode.Username }
          ]
        }, function(err, user){

          if(err || !user) {
            res.status(400).json({status:'error', message: 'Bad Request, token not valid'  });
          }
          else {
            console.log("*************************************************************\nuser passed");
            next();
          }
        });
    }
    else if(decode.hasOwnProperty("Id")){
      googleUserModel.findOne({
        $and:[
          {'Id':decode.Id }
        ]
      }, function(err, user){

        if(err || !user) {
          res.status(400).json({status:'error', message: 'Bad Request, token not valid'  });
        }
        else {
          console.log("*************************************************************\nuser passed");
          next();
        }
      });


    }

    }
    else {
      res.status(400).json({status:'error', message: 'Bad Request, token not found'  });
    }
  }

  }
  catch(err) {
    console.log(err);
    res.status(400).json({"status":400, "message": err.message || "Something is wrong, check again..."});
  }

};
