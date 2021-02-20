var express = require('express');
var router = express.Router();
var {userLogin, userRegister} = require('../controller/user')
var {checkUser} = require('../util/middleware')

router.post('/login',userLogin);
router.post('/register', userRegister);

 router.use('/user',  require('./userNeedCheck'))

module.exports = router;
