const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: './src/index.tsx',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(ts|tsx)?$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', '.tsx'],
        fallback: {
            "crypto": require.resolve("crypto-browserify"),
            // "buffer": require.resolve("buffer/"),
            // "util": require.resolve("util/"),
            "stream": require.resolve("stream-browserify")
        },
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    output: {
        filename: 'bundle.js'
    },

    devServer: {
        port: 4000,
        open: true,
        hot: true
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            hash: true, // This is useful for cache busting
            filename: 'index.html'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        }),
    ],
    externals: {
    },
}
