const webpack = require('webpack');
let webpackMerge = require('webpack-merge');
let commonConfig = require('./webpack.config.common.js');
let LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = webpackMerge(commonConfig, {
    devtool: 'source-map',

    output: {
        path: __dirname + "/public/js/app",
        publicPath: "/js/app/",
        filename: '[name].bundle.js',
        chunkFilename: '[id].chunk.js'
    },
    plugins: [
        new LiveReloadPlugin(),
        new webpack.LoaderOptionsPlugin({
            debug: true,
            options: {
                tslint: {
                    failOnHint: true,
                    configuration: require('./tslint.json')
                }
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'environment': JSON.stringify(process.env.NODE_ENV),
                'publickey': {
                    'maps': JSON.stringify('AIzaSyAFht5eU4BjOis_oHitK7TF01Dh1VgTWJw'),
                    'mercadopago': JSON.stringify('TEST-fdf46f46-0af3-41dc-9807-f31ed3738185')
                }
            }
        })
    ]
});