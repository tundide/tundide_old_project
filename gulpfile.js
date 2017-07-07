const config = require('./gulp.config')();

const del = require('del');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')({ lazy: true });
const runSequence = require('run-sequence');
const install = require("gulp-install");
const jsdoc = require('gulp-jsdoc3');
const apidoc = require('gulp-apidoc');
const compodoc = require('@compodoc/gulp-compodoc');
const webpack = require("webpack");
const gutil = require('gulp-util');

// gulp.task('default', ['debug', 'scss-watcher', 'html-watcher', 'ts-watcher', 'image-watcher'], function() {
//   var msg = {
//     title: 'gulp',
//     subtitle: 'Watching for HTML, CSS and Typescript changes...'
//   };
//   log(msg);
// });

gulp.task('doc', function(done) {
    runSequence('compodoc', 'jsdoc', 'apidoc', function() {
        log('Documentation Complete');
        done();
    });
});

gulp.task('jsdoc', function(cb) {
    let config = require('./config/jsdoc.json');
    gulp.src(['./**/*.js', '!**/node_modules/**/*.*', '!**/public/**/*.*'], { read: true })
        .pipe(jsdoc(config, cb));
});

gulp.task('apidoc', function(done) {
    apidoc({
        src: "./",
        dest: "docs/api",
        debug: false,
        includeFilters: [".*\\.js$"],
        excludeFilters: ["node_modules/"]
    }, done);
});

gulp.task('compodoc', () => {
    gulp.src('src/**/*.ts')
        .pipe(compodoc({
            output: 'docs/client/',
            tsconfig: 'tsconfig.json'
        }));
});

webpackConfig = require('./webpack.config.prod.js'),

    gulp.task('webpack:build', function(done) {
        let myConfig = Object.create(webpackConfig);
        myConfig.plugins = myConfig.plugins.concat(
            new webpack.DefinePlugin({
                'process.env': {
                    // This has effect on the react lib size
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    screw_ie8: true,
                    conditionals: true,
                    unused: true,
                    comparisons: true,
                    sequences: true,
                    dead_code: true,
                    evaluate: true,
                    if_return: true,
                    join_vars: true
                },
                output: {
                    comments: false
                },
                sourceMap: true
            })
        );

        webpack(myConfig, function(err, stats) {
            if (err) throw new gutil.PluginError("webpack", err);
            gutil.log("[webpack]", stats.toString({
                // output options
            }));
            done();
        });
    });

function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path).then(function() {
        if (typeof done === 'function')
            done();
    });
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (let item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

module.exports = gulp;