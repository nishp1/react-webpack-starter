var fs = require("fs")
var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var indexHtml = path.resolve(__dirname, "./app/index.html");

module.exports = function(options) {
	var loaders = {
		"jsx": {
			loader: options.hotComponents ? "react-hot-loader!babel-loader" : "babel-loader",
			include: path.join(__dirname, "app")
		},
		"js": {
			loader: "babel-loader",
			include: path.join(__dirname, "app")
		},
		"html": "html-loader",
		// "md|markdown": ["html-loader", "markdown-loader"],
		// "json": "json-loader",
		// "json5": "json5-loader",
		// "txt": "raw-loader",
		"png|jpg|jpeg|gif|svg": "url-loader?limit=10000",
		"woff|woff2": "url-loader?limit=100000",
		"ttf|eot": "file-loader"
	};
	var stylesheetLoaders = {
		"css": "css-loader",
		// "less": "css-loader!less-loader",
		// "styl": "css-loader!stylus-loader",
		"scss|sass": "css-loader!sass-loader?includePaths[]=" +
			(path.resolve(__dirname, "./node_modules/bootstrap-sass/assets/stylesheets/"))
	};

	var alias = {

	};
	var aliasLoader = {

	};
	var externals = [

	];
	var root = path.join(__dirname, "app");
	var publicPath = options.devServer ? "http://localhost:2992/_assets/" : "/assets/";
	var output = {
		path: path.join(__dirname, "dist/assets/"),
		publicPath: publicPath,
		filename: "[name].js" + (options.longTermCaching ? "?[chunkhash]" : ""),
		chunkFilename: (options.devServer ? "[id].js" : "[name].js") + (options.longTermCaching ? "?[chunkhash]" : ""),
		sourceMapFilename: "debugging/[file].map",
		libraryTarget: undefined,
		pathinfo: options.debug
	};
	var excludeFromStats = [
		/node_modules/
	];

	var indexHtmlContents = fs.readFileSync(indexHtml, "utf-8");
	var plugins = [
		function() {
			this.plugin("done", function(stats) {
				var jsonStats = stats.toJson({
					chunkModules: true,
					exclude: excludeFromStats
				});
				jsonStats.publicPath = publicPath;
				var STYLE_URL = publicPath + jsonStats.assetsByChunkName.main[1];
				var SCRIPT_URL = publicPath + jsonStats.assetsByChunkName.main[0];
				fs.writeFileSync(path.join(__dirname, "dist", "stats.json"), JSON.stringify(jsonStats, null, 4));
				fs.writeFileSync(path.join(__dirname, "dist", "index.html"), indexHtmlContents.replace("SCRIPT_URL", SCRIPT_URL).replace("STYLE_URL", STYLE_URL));
			});
		},
		new webpack.PrefetchPlugin("react"),
		new webpack.PrefetchPlugin("react-router"),
		new webpack.PrefetchPlugin("flummox"),
		new webpack.PrefetchPlugin("jquery")
	];

	if(options.commonsChunk) {
		plugins.push(new webpack.optimize.CommonsChunkPlugin("commons", "commons.js" + (options.longTermCaching ? "?[chunkhash]" : "")));
	}


	Object.keys(stylesheetLoaders).forEach(function(ext) {
		var loaders = stylesheetLoaders[ext];
		if(Array.isArray(loaders)) loaders = loaders.join("!");
		if(options.prerender) {
			stylesheetLoaders[ext] = "null-loader";
		} else if(options.separateStylesheet) {
			stylesheetLoaders[ext] = ExtractTextPlugin.extract("style-loader", loaders);
		} else {
			stylesheetLoaders[ext] = "style-loader!" + loaders;
		}
	});
	if(options.separateStylesheet) {
		plugins.push(new ExtractTextPlugin(options.longTermCaching ? "[name].css?[chunkhash]" : "[name].css"));
	}

	if(options.minimize) {
		plugins.push(
			new webpack.optimize.UglifyJsPlugin(),
			new webpack.optimize.DedupePlugin(),
			new webpack.DefinePlugin({
				"process.env": {
					NODE_ENV: JSON.stringify("production")
				}
			}),
			new webpack.NoErrorsPlugin()
		);
	}

	return {
		entry: "./app/js/main.js",
		output: output,
		target: "web",
		module: {
			loaders: loadersByExtension(loaders).concat(loadersByExtension(stylesheetLoaders))
		},
		devtool: options.devtool,
		debug: options.debug,
		resolveLoader: {
			root: path.join(__dirname, "node_modules"),
			alias: aliasLoader
		},
		externals: externals,
		resolve: {
			root: root,
			modulesDirectories: ['node_modules'],
			extensions: ["", ".js", ".jsx"],
			alias: alias,
		},
		plugins: plugins,
		devServer: {
			stats: {
				cached: false,
				exclude: excludeFromStats
			}
		}
	};
};

function loadersByExtension(obj) {
	var loaders = [];
	var extensions = Object.keys(obj).map(function(key) {
		return key.split("|");
	}).reduce(function(arr, a) {
		arr.push.apply(arr, a);
		return arr;
	}, []);
	Object.keys(obj).forEach(function(key) {
		var exts = key.split("|");
		var value = obj[key];
		var entry = {
			extensions: exts,
			test: extsToRegExp(exts),
			loaders: value
		};
		if(Array.isArray(value)) {
			entry.loaders = value;
		} else if(typeof value === "string") {
			entry.loader = value;
		} else {
			Object.keys(value).forEach(function(key) {
				entry[key] = value[key];
			});
		}
		loaders.push(entry);
	});
	return loaders;
};

function extsToRegExp(exts) {
	return new RegExp("\\.(" + exts.map(function(ext) {
		return ext.replace(/\./g, "\\.") + "(\\?.*)?";
	}).join("|") + ")$");
}
