module.exports = function() {
    let client = './src/';


    let config = {
        /**
         * File paths
         */
        publishdirectory: '/opt/bitnami/apps/tundide',
        ssh: {
            host: '132.148.65.67',
            port: 22,
            username: 'strumentit',
            password: 'Strumentit34518147*'
        },
        sftp: {
            host: '132.148.65.67',
            port: 22,
            username: 'strumentit',
            password: 'Strumentit34518147*',
            publishdirectory: '/opt/bitnami/apps/tundide'
        },
        build: './public/',
        publish: './dist/',
        css: client + '**/*.css',
        html: client + '**/*.html',
        images: client + 'images/**/*.*',
        imagesRoot: 'images',
        scss: client + '**/*.scss',
        src: client,
        ts: client + '**/*.ts',
        node_modules: './node_modules/',
        node_modulesRoot: 'node_modules',
        tsMaps: '.', // write map in same location as js

    };

    return config;
};