var express = require('express');
var cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config;
try {
    config = require('config');
} catch (e) {
    console.warn('config module not found, using fallback config. Install "config" for full functionality.');
    config = { get: function () { return {}; } };
}
var redis = require('redis')

var routes = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');
var stats = require('./routes/estadisticas');
var stock = require('./routes/stock');

var app = express();
var fs = require('fs');

function logCrash(label, err) {
    try {
        var dir = path.join(__dirname, 'logs');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        var msg = new Date().toISOString() + ' [' + label + '] ' + (err && (err.stack || err.message || err)) + '\n';
        fs.appendFileSync(path.join(dir, 'node-crash.log'), msg, { encoding: 'utf8' });
    } catch (e) {
        console.error('Failed to write crash log:', e);
    }
}

process.on('uncaughtException', function (err) {
    console.error('Uncaught exception:', err);
    logCrash('uncaughtException', err);
});

process.on('unhandledRejection', function (reason) {
    console.error('Unhandled rejection:', reason);
    logCrash('unhandledRejection', reason);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '20mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS for all routes
// Explicitly allow common headers (fixes preflight failures for Content-Type)
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
}));

if (app.get('env') === 'production') {
    var client = redis.createClient('/var/run/redis/redis.sock');
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
}

// Register routes
app.use('/', routes);
app.use('/api/v1/users', users);
app.use('/api/v1/estadisticas', stats);
app.use('/api/v1/stock', stock);
app.use('/api/v1', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found: ' + req.method + ' ' + req.originalUrl);
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        console.error(err);
        if (req.path && req.path.indexOf('/api/') === 0) {
            res.status(err.status || 500).json({
                error: {
                    message: err.message,
                    status: err.status || 500,
                    type: err.name || 'Error',
                    code: err.code || null
                }
            });
            return;
        }
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
    console.error(err);
    if (req.path && req.path.indexOf('/api/') === 0) {
        res.status(err.status || 500).json({
            error: {
                message: err.message,
                status: err.status || 500,
                type: err.name || 'Error',
                code: err.code || null
            }
        });
        return;
    }
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
