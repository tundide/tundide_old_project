const webpack = require('webpack');
let webpackMerge = require('webpack-merge');
let commonConfig = require('./webpack.config.common.js');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
    devtool: 'source-map',

    output: {
        path: './public/js/app',
        publicPath: "/js/app/",
        filename: '[name].bundle.js',
        chunkFilename: '[id].chunk.js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV)
            }
        })
    ]
});