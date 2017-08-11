import { mergeWith, isArray } from 'lodash';
import WebpackTask from './WebpackTask';

/*
 |----------------------------------------------------------------
 | Webpack
 |----------------------------------------------------------------
 |
 | This task will allow you to use ES2015 code in any browser.
 | It leverages Webpack and Buble to transform and compile
 | your code into a single entry point for the browser.
 |
 */

Elixir.webpack = {
    config: {
        watch: Elixir.isWatching(),
        watchOptions: {
            poll: false,
            ignored: /node_modules/
        },
        devtool: Elixir.config.sourcemaps ? 'eval-cheap-module-source-map' : '',
        module: {
            rules: [{
                test: /\.js$/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        presets: [
                            [ "env", {
                                "modules": false,
                                "targets": {
                                    "browsers": [ "> 2%" ],
                                    "uglify": true
                                }
                            } ],
                            "stage-2"
                        ],
                        plugins: [ "transform-runtime" ]
                    }
                }],
                exclude: [/node_modules/],
            }]
        },
        resolve: {
            extensions: [".js"]
        }
    },

    mergeConfig: function mergeConfig(newConfig) {
        return this.config = mergeWith(this.config, newConfig, function (objValue, srcValue) {
            if (isArray(objValue)) {
                return objValue.concat(srcValue);
            }
        });
    }
};


Elixir.extend('webpack', function(scripts, output, baseDir, options) {
    new WebpackTask(
        'webpack', getPaths(scripts, baseDir, output), options
    );
});


/**
 * Prep the Gulp src and output paths.
 *
 * @param  {string|Array} src
 * @param  {string|null}  baseDir
 * @param  {string|null}  output
 * @return {GulpPaths}
 */
function getPaths(src, baseDir, output) {
    return new Elixir.GulpPaths()
        .src(src, baseDir || Elixir.config.get('assets.js.folder'))
        .output(output || Elixir.config.get('public.js.outputFolder'), 'all.js');
}
