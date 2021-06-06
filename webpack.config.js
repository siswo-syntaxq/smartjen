var path = require('path');
const webpack = require("webpack"); 
module.exports = {
	entry: './raw-app.js',
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'app.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
				loader: 'babel-loader',
				}
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			},
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
					$: "jquery",  
					jQuery: "jquery" 
				})
		],
}