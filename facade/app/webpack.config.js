const path = require('path')
const nodeExternals = require('webpack-node-externals')
const NodemonPlugin = require('nodemon-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'

module.exports = {
    // TODO: Check behaviour on Ubuntu and MacOS
    // Need watchOptions enabled for Windows x Docker to watch and reload properly
    // Note the legacyWatch below
    watchOptions: {
        poll: 500,
        ignored: /node_modules/
    },
    // mode: isDev ? 'development' : 'production',
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './server.js',
    output: {
        filename: 'final.js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        minimize: false
    },
    externalsPresets: {
        node: true
    },
    externals: [nodeExternals()],
    plugins: [
        new NodemonPlugin({
            // verbose: true,
            ext: 'js,njk',
            watch: path.resolve('.'),
            legacyWatch: true,
            nodeArgs: ['--trace-warnings']
        })
    ],

    module: {
        rules: [
            {
                test: /\.(njk|nunjucks)$/,
                loader: 'nunjucks-loader'
            }
        ]
    }
}