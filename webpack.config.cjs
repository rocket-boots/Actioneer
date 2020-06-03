const path = require('path');
const package = require('./package.json');
// const nodeExternals = require('webpack-node-externals');
const dirPath = path.resolve(__dirname);
const filename = `index.cjs`;

console.log(
	'\n------------------------------------------------------------------------------\n',
	`Building ${package.name} into ${dirPath}/${filename}`,
	'\n------------------------------------------------------------------------------\n'
);

const ex = {
	mode: 'production',
	target: 'node', // vs. 'web'
	entry: package.exports.import,
	output: {
		filename,
		path: dirPath,
		libraryExport: 'default',
		libraryTarget: 'commonjs'
	},
	devtool: 'inline-source-map',
	optimization: { minimize: false }, // TODO: remove when not testing
	// externals: [nodeExternals()], // for node
};
module.exports = ex;
