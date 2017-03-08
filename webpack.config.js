var path = require('path');

module.exports = {
    entry: [
        path.resolve(__dirname, 'src/main.js')
    ],

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'breakout.min.js'
    },

    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['babel-loader']
        }]
    }
};