var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'app/dist');
var APP_DIR = path.resolve(__dirname, 'app');

var config = {
    entry: APP_DIR + '/main.jsx',
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
        }
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
