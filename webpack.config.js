var path = require('path');
var webpack = require('webpack');
module.exports = {
    context: path.join(__dirname, './wwwroot/src/'),
    entry: './main.ts',
    output: {
        path: path.join(__dirname, './wwwroot/built'),
        publicPath: 'built',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            { test: /\.js$/, loader: 'babel-loader', query: { presets: ['es2015'] } },
            { test: /\.vue$/, loader: 'vue-loader' },
            { test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/, },
            // { test: /\.tsx?$/, loader: 'vue-ts-loader' }
            { test: /\.html$/, loader: "html-loader" },

        ],


    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js',
            jquery: 'jquery/dist/jquery.js'
        },
        modules: [
            path.resolve('./wwwroot/src/'),
            path.resolve('./node_modules')

        ],


        extensions: [".tsx", ".ts", ".js"]

    },

    plugins: [
        // new webpack.optimize.UglifyJsPlugin({ minimize: true }),
        new webpack.ProvidePlugin(
            {
                jQuery: 'jquery',
                $: 'jquery',
                jquery: 'jquery',
                'window.$': 'jquery',
                'window.jQuery' : 'jquery'
                
            })
    ]
};