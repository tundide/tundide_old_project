const webpack = require('webpack');
let webpackMerge = require('webpack-merge');
let commonConfig = require('./webpack.config.common.js');

module.exports = webpackMerge(commonConfig, {
    output: {
        path: __dirname + "/public/js/app",
        publicPath: "/js/app/",
        filename: '[name].bundle.js',
        chunkFilename: '[id].chunk.js'
    },
    plugins: [
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
            }
        })
    ]
});