const path = require("path");

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    // plugins: [
    //     new HtmlWebpackPlugin({
    //         title: "The You Do ToDo Space",
    //         favicon: 
    //     })
    // ],
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-class-properties'],
                    }
                }
            },
            {
                test: /\.(woff|woff2|ttf)$/i,
                type: 'asset/resource'
            },
        ]
    }
}