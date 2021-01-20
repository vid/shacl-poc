const HtmlWebpackPlugin = require('html-webpack-plugin');

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
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', '.tsx']
    },
    output: {
        filename: 'bundle.js'
    },

    devServer: {
        port: 4000,
        open: true,
        hot: true
    },

    plugins: [new HtmlWebpackPlugin({
        template: 'src/index.html',
        hash: true, // This is useful for cache busting
        filename: 'index.html'
    })]
}
