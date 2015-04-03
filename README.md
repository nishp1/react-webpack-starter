# webpack/react-starter
Starter template for react and webpack. Based off of great https://github.com/webpack/react-starter, backend rendering removed.

## Features

* Compilation with webpack
* React and jsx
* react-router
* Stylesheets can be CSS, LESS, SASS, Stylus or mixed
* Embedded resources like images or fonts use DataUrls if appropriate
* A simple flag loads a react component (and dependencies) on demand.
* Development
  * Development server
  * Optionally Hot Module Replacement development server (LiveReload for Stylesheets and React components enabled)
  * Uses SourceUrl for performance, but you may switch to SourceMaps easily
* Production
  * Long Term Caching through file hashes enabled
  * Generate separate css file to avoid FOUC
  * Minimized CSS and javascript

## Local Installation

Install [node.js](https://nodejs.org) or [io.js](https://iojs.org)

Just clone this repo and change the `origin` git remote.

``` text
npm install
```

## Development server

``` text
# start the webpack-dev-server
npm run dev-server
# wait for the first compilation is successful

# in another terminal/console
# start the node.js server in development mode
npm run start

# open this url in your browser
http://localhost:8080/
```

The configuration is `webpack-dev-server.config.js`.

It automatically recompiles and refreshes the page when files are changed.

Also check the [webpack-dev-server documentation](http://webpack.github.io/docs/webpack-dev-server.html).


## Hot Module Replacement development server

``` text
# start the webpack-dev-server in HMR mode
npm run hot-dev-server
# wait for the first compilation is successful

# in another terminal/console
# start the node.js server in development mode
npm run start-dev

# open this url in your browser
http://localhost:8080/
```

The configuration is `webpack-hot-dev-server.config.js`.

It automatically recompiles when files are changed. When a hot-replacement-enabled file is changed (i. e. stylesheets or React components) the module is hot-replaced. If Hot Replacement is not possible the page is refreshed.

Hot Module Replacement has a performance impact on compilation.


## Production compilation and server

``` text
# build the client bundle and the prerendering bundle
npm run build
```
The configuration is `webpack-production.config.js`.
You can serve up `dist` directory from Apache, Nginx or using `python -m SimpleHTTPServer`.

## Build visualization

After a production build you may want to visualize your modules and chunks tree.

Use the [analyse tool](http://webpack.github.io/analyse/) with the file at `build/stats.json`.


## Loaders and file types

If you get an error like `Cannot find module "xxx-loader"`, you'll need to install the loader with `npm install xxx-loader --save` and restart the compilation.


## Common changes to the configuration

### Switch devtool to SourceMaps

Change `devtool` property in `webpack-dev-server.config.js` and `webpack-hot-dev-server.config.js` to `"source-map"` (better module names) or `"eval-source-map"` (faster compilation).

SourceMaps have a performance impact on compilation.

### Enable SourceMaps in production

1. Uncomment the `devtool` line in `webpack-production.config.js`.
2. Make sure that the folder `build\public\debugging` is access controlled, i. e. by password.

SourceMaps have a performance impact on compilation.

SourceMaps contains your unminimized source code, so you need to restrict access to `build\public\debugging`.
