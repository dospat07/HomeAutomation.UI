var path = require('path');
var webpack = require('webpack');

module.exports = {
    devServer: {
        historyApiFallback: {
            index: 'index.html'
        },
        host: '0.0.0.0'
    },
    devtool: "source-map",
    context: path.join(__dirname, './wwwroot/src/'),
    entry: [ './main.ts'],
    output: {
        path: path.join(__dirname, './wwwroot/built'),
        publicPath: 'built',
        filename: 'bundle.js'
    },
    module: {
        rules: [

            { test: /\.vue$/, loader: 'vue-loader' },
            { test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/, },
            // { test: /\.tsx?$/, loader: 'vue-ts-loader' }
            { test: /\.html$/, loader: "html-loader" },
            { test: /\.js$/, loader: "babel-loader", query: {presets: ['es2015' ]}}
            // { test: /\.js$/, loader: "source-map-loader", enforce: 'pre' },
        ]
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
                  
        new webpack.ProvidePlugin(
            {
                jQuery: 'jquery',
                $: 'jquery',
                jquery: 'jquery',
                'window.$': 'jquery',
                'window.jQuery': 'jquery'        
            }),
      
    ]
};