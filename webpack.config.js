const MonacoPlugin = require("monaco-editor-webpack-plugin");
module.exports = {
    mode: "production",
    entry: "./src/main/javascript/index.js",
    resolve: {
        fallback: {
            "fs": false
        },
    },
    plugins: [new MonacoPlugin({languages: []})]
}
