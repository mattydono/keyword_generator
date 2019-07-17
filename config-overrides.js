const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');

module.exports = {
    webpack: function(config, env) {
        console.log('Using rewired webpack configuration');

        if (env === 'production') {
            config.plugins.splice(0, 1); // Remove original HtmlWebpackPlugin
            config.plugins.push(
                new HtmlWebpackPlugin({
                    filename: 'app.html',
                    inject: true,
                    template: require.resolve('./public/index.html'),
                    minify: true
                }),
                new ScriptExtHtmlWebpackPlugin({ inline: '.js' }),
                new StyleExtHtmlWebpackPlugin()
                );
        }

        return config;
    }
}