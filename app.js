var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var {checkAPP, checkUser} = require('./util/middleware')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//增加管理员路由

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//设置允许跨域访问该服务.
//设置跨域访问
app.all('*', function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

app.use('/',  indexRouter);
app.use('/users', usersRouter);
app.use('/admin', checkUser, usersRouter);
module.exports = app;