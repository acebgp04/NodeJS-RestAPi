var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var data = require('./data');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var bodyParser = require("body-parser");
var sql = require("mssql");

var app = express();

// Body Parser Middleware
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
  next();
});

// config for your database
var config = {
  user: '****',
  password: '****',
  server: '****',
  database: '****'
};
var connection = sql.connect(config, function (err) {
  if (err)
    throw err;
});

module.exports = connection;
//Function to connect to database and execute query
var  executeQuery = function(res, query){

      // create Request object
      var request = new sql.Request();
      // query to the database
      request.query(query, function (err, recordset) {

        if (err) console.log(err)

        // send records as a response
        res.send(recordset);

      });

}

//GET API
app.get("/api/stream", function(req , res){
  var query = "select * from dv_BusStream";
  executeQuery (res, query);
});

//PUT API
app.put("/api/stream/:id", function(req , res){
  var query = "UPDATE dt_BusStream SET timestamp = " + req.query.timestamp + "  WHERE Id= " + req.params.id;
  executeQuery (res, query);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
