var express = require('express');
var cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('config');
var redis = require('redis'), client = redis.createClient('/tmp/redis.sock');

var routes = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');
var stats = require('./routes/estadisticas');
var stock = require('./routes/stock');

var app = express();

if (process.env.hasOwnProperty('DYLD_LIBRARY_PATH')) {
    console.log(process.env.DYLD_LIBRARY_PATH);
} else {
    console.log('Warning: DYLD_LIBRARY_PATH no esta definido.');
}

if (process.env.hasOwnProperty('LD_LIBRARY_PATH')) {
    console.log(process.env.LD_LIBRARY_PATH);
} else {
    console.log('Warning: LD_LIBRARY_PATH no esta definido.');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors()); //TODO: revisar seguridad al usar cors
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    if (req.cookies && req.cookies.sessionid) {
        var sessionid = 'session:' + req.cookies['sessionid'];
        client.get(sessionid, function (err, data) {
            if (data) {
                var sessionData = new Buffer(data, 'base64').toString();
                var sessionObjString = sessionData.substring(sessionData.indexOf(":") + 1);
                var sessionObjJSON = JSON.parse(sessionObjString);
                req.user = sessionObjJSON['_auth_user_id'];
                req.loggedin = true;
                next();
            } else {
                res.status(401).send('Unauthorized');
            }
        });
    } else {
        res.status(401).send('Unauthorized');
    }
});

// Register routes
app.use('/', routes);
app.use('/api/v1/users', users);
app.use('/api/v1', api);
app.use('/api/v1/estadisticas', stats);
app.use('/api/v1/stock', stock);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
