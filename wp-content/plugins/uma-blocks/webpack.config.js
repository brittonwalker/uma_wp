const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = [
	{
		...defaultConfig,
		entry: {
			...defaultConfig.entry(),
			'editor-styles': path.resolve(__dirname, 'src/editor-styles/index.js'),
		},
		resolve: {
			...defaultConfig.resolve,
			alias: {
				'@components': path.resolve(__dirname, 'src/components'),
				'@svg': path.resolve(__dirname, 'src/svg'),
			},
		},
	},
];
