/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */
'use strict';

const ExtensionManifest = include('build/webpack/plugins/extension-manifest/extension-manifest');

/**
 * This plugin creates extension manifest after webpack has finished the compilation
 */
module.exports = class ExtensionManifestPlugin {
	/**
	 * Plugin params
	 * @type {import('./extension-manifest').ExtensionManifestArgs}
	 */
	params;

	/**
	 * True, if manifest is already created.
	 * It is needed in watch mode.
	 *
	 * @type {boolean}
	 */
	manifestCreated = false;

	/**
	 * @param {import('./extension-manifest').ExtensionManifestArgs} params
	 */
	constructor(params) {
		this.params = params;
	}

	/**
	 * Webpack plugin execute method
	 * @param {import('webpack').Compiler} compiler
	 */
	apply(compiler) {
		compiler.hooks.done.tap(this.constructor.name, ({compilation}) => {
			const isLastCompilation = compilation.compiler?.name === 'html';

			if (!this.manifestCreated && isLastCompilation) {
				new ExtensionManifest(this.params).create();

				this.manifestCreated = true;
			}
		});
	}
};
