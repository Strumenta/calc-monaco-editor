module.exports = {
    mode: "production",
    entry: "./src/main/javascript/index.js",
    resolve: {
        fallback: {
            "fs": false
        },
    }
}
