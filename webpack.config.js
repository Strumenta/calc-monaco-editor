module.exports = {
    entry: './src/main/javascript/index.js',
    output: {
        filename: 'main.js',
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    resolve: {
        modules: ['node_modules'],
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    //mode: 'production',
    mode: 'development',
    node: {
        fs: 'empty',
        global: true,
        crypto: 'empty',
        tls: 'empty',
        net: 'empty',
        process: true,
        module: false,
        clearImmediate: false,
        setImmediate: false
    },
    optimization: {
        // We no not want to minimize our code.
        minimize: false
    }
}