require('./jobs.js');
// require('./mercadopago.js');
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
const compression = require('compression');
let passport = require('passport');
let session = require('express-session');
let flash = require('connect-flash');
let mongoose = require('mongoose');
let MongoStore = require('connect-mongo')(session);
let cors = require('cors');
let configAuth = require('./appConfig.json');
let cache = require('memory-cache');
let _ = require('lodash');

mongoose.connect('mongodb://127.0.0.1:27017/tundide', function(err) {
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
app.use(cors({ origin: 'http://localhost:3001' }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' }));
app.use(cookieParser(configAuth.auth.secret));

app.use(session({
    secret: configAuth.auth.secret,
    cookie: {
        maxAge: configAuth.auth.maxAge
    },
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/node_modules", express.static(path.join(__dirname, 'node_modules')));


app.use(function(req, res, next) {
    if (req.headers.authorization) {
        let session = cache.get('sessions_' + req.headers.authorization);

        req.user = session;
    }


    res.locals.isAuthenticated = req.isAuthenticated();
    next();
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