var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'app/dist');
var APP_DIR = path.resolve(__dirname, 'app');

var config = {
    entry: [
        APP_DIR + '/main.jsx',
        APP_DIR + '/styles/main.less',
    ],
    output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
},
resolve: {
    extensions: ['', '.js', '.jsx']
},
module : {
    loaders : [
        {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel'
        },
        {
        test: /\.less$/,
        loader: "style!css!autoprefixer!less"
        },
    ],
},
plugins: [
    new webpack.DefinePlugin({
        // A common mistake is not stringifying the "production" string.
        'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    })
]
};

module.exports = config;
