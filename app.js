require('./jobs.js');
require('./mercadopago.js');
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
const compression = require('compression');
let passport = require('passport');
let mongoose = require('mongoose');
let cors = require('cors');
let User = require('./models/user');
let config = require('./config/app.json')[process.env.NODE_ENV || 'development'];
let env = require('node-env-file');

env(__dirname + '/.env', { raise: false });

mongoose.connect(process.env.MONGODB_URI, config.database.mongodb.config, function(err) {
    if (err) {
        console.log(err);
    }
});

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(favicon(path.join(__dirname, 'public', '/favicon/favicon.ico')));
app.use(logger('dev'));
app.use(compression());
app.use(cors({ origin: config.url }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' }));
app.use(cookieParser(config.auth.secret));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/node_modules", express.static(path.join(__dirname, 'node_modules')));


app.use(function(req, res, next) {
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(' ')[1];
        User.findOne({ 'authentication.token': token }, function(error, result) {
            if (error) return;

            req.user = result;
            next();
        });
    } else {
        next();
    }
});

let routes = require('./routes/routes');
routes(app, passport, mongoose);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
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