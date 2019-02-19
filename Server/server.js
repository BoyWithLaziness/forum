var express = require('express');
var app = express();
var session = require('express-session');
var cookieParser = require('cookie-parser');
var Handlebars = require('handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');

var config = require('./config/config') ;
var multer = require('multer');
var DIR = './public/uploads/';

app.use(cookieParser()) ;
app.use(session({
  secret:config.secretKey,
  saveUninitialized:true,
  resave:false,
  cookie:{ secure: false }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors({ origin: config.baseUrl,credentials: true}));

// app.use('/*',function(req,res,next){
//   // req.setHeader("Content-Type", "application/json");
//   // res.setHeader("Content-Type", "application/json");
//   //res.setHeader("Content-Type", "application/json");
//   res.header("Access-Control-Allow-Credentials",true);
//   res.header("Access-Control-Allow-Order","http://localhost:4200/");
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header("Access-Control-Allow-Methods","GET, PUT, POST, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Headers","enctype,formenctype,Origin, Accept,X-Requested-With,Content-type,X-Acces-Token,X-Key,multipart/form-data");
//
//   if(req.method == 'OPTIONS') {
//     res.status(200).end();
//   }
//   else{
//     next();
//   }
//
// });

//database connection
mongoose.connect(config.mongo.url, function(err, database){
  if(err) {
    console.log(err);
    process.exit(1);
  }
  console.log("database connection done, baby!");
});

app.use('/*',[require('./middlewares/validateRequest')]);
app.use('/',require('./routes'));
app.use('/',function(req,res,next){
  res.status(404).json({status:"Page Not Found,Sorry Buddy..."}).end();
});



//port set
app.set('port',config.port);
//starting server
app.listen(app.get('port'),function(){
  console.log("App started on port.",app.get('port'));
});
