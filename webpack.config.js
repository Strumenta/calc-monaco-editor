const MonacoPlugin = require("monaco-editor-webpack-plugin");
module.exports = {
    mode: "production",
    entry: "./src/main/javascript/index.js",
    resolve: {
        fallback: {
            "fs": false
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    plugins: [new MonacoPlugin({languages: []})]
}
