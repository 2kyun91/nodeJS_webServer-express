var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(function (req, res, next) {
  console.log(req.url, '저도 미들웨어입니다.');
  next();
});

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secret code'));
app.use(session({
  resave : false,
  saveUninitialized : false,
  secret : 'secret code',
  cookie : {
    httpOnly : true, // 클라이언트에서 쿠키를 확인하지 못하도록 한다.
    secure : false, // https가 아닌 환경에서도 사용할 수 있게 한다. 배포 시에는 https를 적용하고 secure도 true로 설정하는 것이 좋다.
    // store라는 옵션도 있는데 데이터베이스를 연결하여 세션을 유지하는 것이 좋다.
    // 보통 Redis가 자주 쓰인다.
  },
}));
app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
