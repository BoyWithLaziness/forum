var express = require('express');
var router = express.Router();

var users = require('./controllers/users');
var googleUsers = require('./controllers/googleUsers');
var QandA = require('./controllers/QandA');
var config = require('./config/config');



console.log("inside----------ROUTES------");
//Don't require token--requests
router.post('/forum/login',users.login);
router.post('/forum/is_unique',users.isUnique);
router.post('/forum/create_user',users.create);
router.get('/forum/show',users.show);
router.get('/forum/get_users',users.getUsers);
router.get('/forum/check_login',users.checkLogin);
router.get('/forum/get_questions',QandA.getQuestions);
router.post('/forum/get_question',QandA.getQuestion);
router.post('/forum/get_answers',QandA.getAnswers);
router.post('/forum/get_tagged_questions',QandA.getTaggedQuestions);
router.post('/forum/get_google_username',googleUsers.getGoogleUserName);
//google
router.post('/forum/google_create',googleUsers.googleCreate);
router.post('/forum/google_user_exists',googleUsers.googleUserExists);
router.post('/forum/google_login',googleUsers.googleLogin);
router.get('/forum/google_users',googleUsers.getUsers)

//Require token requests
router.post('/forum/get_token_value',users.getTokenValue)
router.post('/forum/get_user',users.getUser);
router.get('/forum/user_logout',users.logout);
router.post('/forum/add_answer',QandA.addAnswer);
router.post('/forum/add_question',QandA.addQuestion);
router.post('/forum/add_likes',QandA.incrementLikeCount);
router.post('/forum/get_tags',QandA.getTags);
router.post('/forum/is_liked',users.isLiked);
router.post('/forum/change_like_status',users.changeLikeStatus);
router.post('/forum/decrement_likes',QandA.decrementLikeCount);
router.post('/forum/get_google_user',googleUsers.getUser);
router.post('/forum/get_google_user_qa_info',googleUsers.getQAInfo);
router.post('/forum/get_user_qa_info',users.getQAInfo)

module.exports = router;
