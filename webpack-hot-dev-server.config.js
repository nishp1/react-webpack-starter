module.exports = require("./make-webpack-config")({
    separateStylesheet: true,
    devServer: true,
    hotComponents: true,
    devtool: "eval",
    debug: true
});
