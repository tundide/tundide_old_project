const config = require('./gulp.config')();

const del = require('del');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')({ lazy: true });
const runSequence = require('run-sequence');
const GulpSSH = require('gulp-ssh');
const install = require("gulp-install");
const typedoc = require("gulp-typedoc");
const jsdoc = require('gulp-jsdoc3');
const apidoc = require('gulp-apidoc');

// gulp.task('default', ['debug', 'scss-watcher', 'html-watcher', 'ts-watcher', 'image-watcher'], function() {
//   var msg = {
//     title: 'gulp',
//     subtitle: 'Watching for HTML, CSS and Typescript changes...'
//   };
//   log(msg);
// });

gulp.task('doc', function(done) {
    runSequence('jsdoc', 'typedoc', 'apidoc', function() {
        log('Documentation Complete');
        done();
    });
});

gulp.task('jsdoc', function(cb) {
    let config = require('./config/jsdoc.json');
    gulp.src(['./**/*.js', '!**/node_modules/**/*.*', '!**/public/**/*.*'], { read: true })
        .pipe(jsdoc(config, cb));
});

gulp.task("typedoc", function() {
    return gulp
        .src(["src/**/*.ts", "!**/*.aot.ts"])
        .pipe(typedoc({
            module: "commonjs",
            target: "es5",
            out: "docs/client",
            name: "Tundide",
            exclude: '**/node_modules/**/*.*',
            experimentalDecorators: true,
            excludeExternals: true
        }));
});

gulp.task('apidoc', function(done) {
    apidoc({
        src: "./",
        dest: "docs/api",
        debug: true,
        includeFilters: [".*\\.js$"],
        excludeFilters: ["node_modules/"]
    }, done);
});

gulp.task('publish', function(done) {
    runSequence('pub:siteStop', 'pub:clean:publish', 'pub:upload', 'pub:siteStart', function() {
        log('Upload Finished');
        done();
    });
});

gulp.task('pub:upload', function() {
    let gulpSSH = new GulpSSH({
        ignoreErrors: false,
        sshConfig: config.ssh
    });

    return gulp.src([
            './**/*',
            '!./{src,src/**}',
            '!./{aot,aot/**}',
            '!./{node_modules,node_modules/**}',
            '!./{logs,logs/**}',
            '!./**/*.log',
            '!./{gulpfile.js,gulp.config.js,webpack.config.common.js,webpack.config.dev.js,webpack.config.prod.js}',
            '!./{tsconfig.json,tsconfig.aot.json,tslint.json}'
        ])
        .pipe($.replace('http://localhost:3000', 'http://www.strumentit.com'))
        .pipe($.changed(config.publish, { hasChanged: $.changed.compareSha1Digest }))
        .pipe(gulpSSH.dest(config.publishdirectory));
});

gulp.task('pub:clean:publish', function(callback) {
    let gulpSSH = new GulpSSH({
        ignoreErrors: false,
        sshConfig: config.ssh
    });

    return gulpSSH
        .shell(['cd ' + config.publishdirectory,
            'sudo rm -rf *'
        ], { filePath: 'shell.log' })
        .pipe(gulp.dest('logs'));
});

gulp.task('pub:siteStop', function(callback) {
    let gulpSSH = new GulpSSH({
        ignoreErrors: false,
        sshConfig: config.ssh
    });

    return gulpSSH
        .shell(['sudo pm2 stop www'], { filePath: 'shell.log' })
        .pipe(gulp.dest('logs'));
});

gulp.task('pub:siteStart', function(callback) {
    let gulpSSH = new GulpSSH({
        ignoreErrors: false,
        sshConfig: config.ssh
    });

    return gulpSSH
        .shell([
            'cd ' + config.publishdirectory,
            'sudo npm install',
            'sudo pm2 start www'
        ], { filePath: 'shell.log' })
        .pipe(gulp.dest('logs'));
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