/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

/* eslint-disable camelcase */

'use strict';

const
	fs = require('fs'),
	path = require('upath');

const
	config = require('@config/config');

const
	{manifestFileName} = include('build/const');

const
	{isProd} = include('build/webpack/module/const'),
	isManifestV2 = config.extensionManifestVersion === '2';

/**
 * @typedef {object} ExtensionManifestArgs
 * @prop {string} manifestTemplatePath
 * @prop {string} manifestV2TemplatePath
 */

/**
 * Extension manifest instance
 */
module.exports = class ExtensionManifest {
	/**
	 * Absolute path to the manifest template
	 * @type {string}
	 */
	manifestTemplatePath;

	/**
	 * Absolute path to the manifest v2 template
	 * @type {string}
	 */
	manifestV2TemplatePath;

	/**
	 * Path to the dist directory
	 * @type {string}
	 */
	buildOutputPath = config.src.clientOutput();

	/**
	 * Extension version
	 * @type {string}
	 */
	version = this.getVersion();

	/**
	 * Extension content security policy
	 * @type {string}
	 */
	csp = this.getCsp();

	/**
	 * Path to the devtools
	 * @type {string}
	 */
	devtoolsPath = this.getRelativePath('p-devtools.html');

	/**
	 * Path to the extension default popup
	 */
	popupPath = this.getRelativePath('p-popup-disabled.html');

	/**
	 * Path to the extension's service worker
	 * @type {string}
	 */
	backroundScriptPath = this.getRelativePath('service.worker.js');

	/**
	 * Allowed icon sizes
	 * @type {Array}
	 */
	iconSizes = [16, 32, 48, 128];

	/**
	 * Map of the icons' sizes to their path
	 * @type {object}
	 */
	iconsPathBySize = this.iconSizes.reduce((acc, size) => {
		acc[size] = this.getRelativePath(`assets/icons/enabled/${size}.png`);
		return acc;
	}, {});

	/**
	 * @param {ExtensionManifestArgs} params
	 */
	constructor(params) {
		this.manifestTemplatePath = params.manifestTemplatePath;
		this.manifestV2TemplatePath = params.manifestV2TemplatePath;
	}

	create() {
		const
			compiledManifestPath = path.join(this.buildOutputPath, manifestFileName),
			manifest = isManifestV2 ? this.getManifestV2() : this.getManifestV3();

		fs.writeFileSync(compiledManifestPath, JSON.stringify(manifest, null, 2));
	}

	/**
	 * Returns a compiled manifest v3
	 *
	 * @returns {object}
	 */
	getManifestV3() {
		const manifest = require(this.manifestTemplatePath);

		manifest.version = this.version;

		manifest.content_security_policy = this.csp;

		manifest.background ??= {};
		manifest.background.service_worker = this.backroundScriptPath;

		manifest.action ??= {};
		manifest.action.default_popup = this.popupPath;

		manifest.devtools_page = this.devtoolsPath;

		manifest.icons = this.iconsPathBySize;
		manifest.action.default_icon = this.iconSizes.reduce((acc, size) => {
			acc[size] = this.getRelativePath(`assets/icons/disabled/${size}.png`);
			return acc;
		}, {});

		if (!isProd) {
			this.setManifestDebugInfo(manifest);
		}

		return manifest;
	}

	/**
	 * Returns a compiled manifest v2
	 *
	 * @returns {object}
	 */
	getManifestV2() {
		const manifest = require(this.manifestV2TemplatePath);

		manifest.version = this.version;

		manifest.content_security_policy = this.csp.extension_pages;

		manifest.background ??= {};
		manifest.background.scripts = [this.backroundScriptPath];
		manifest.background.persistent = false;

		manifest.browser_action ??= {};
		manifest.browser_action.default_popup = this.popupPath;
		manifest.devtools_page = this.devtoolsPath;

		manifest.icons = this.iconsPathBySize;

		if (!isProd) {
			this.setManifestDebugInfo(manifest);
		}

		return manifest;
	}

	/**
	 * Returns an extension version
	 *
	 * @returns {string}
	 * @throws {Error}
	 */
	getVersion() {
		const version = config.version();

		if (/[^\d.]/.test(version)) {
			throw new Error(`Invalid package version ${version}.\nSee https://developer.chrome.com/docs/extensions/mv3/manifest/version/ for details.`);
		}

		return version;
	}

	/**
	 * Генерирует CSP для расширения
	 * @returns {{extension_pages: string}}
	 */
	getCsp() {
		return {
			extension_pages: "script-src 'self'; object-src 'self'"
		};
	}

	/**
	 * Add debug info to the extension manifest
	 * @param {object} manifest
	 */
	setManifestDebugInfo(manifest) {
		const
			versionName = `${manifest.version}-debug`,
			name = `${manifest.name} [DEBUG]`,
			description = `${manifest.description} [DEBUG]`;

		manifest.version_name = versionName;
		manifest.name = name;
		manifest.description = description;
	}

	/**
	 * Gets the path to the icon of the specified size
	 *
	 * @param {number} size
	 * @returns {string}
	 */
	getIconPath(size) {
		return this.getRelativePath(`assets/icons/disabled/${size}.png`);
	}

	/**
	 * Checks that specified file exists amd returns relative path for this file to dist directory
	 *
	 * @param {string} fileName
	 * @throws {Error} - if file doesn't exist
	 * @returns {string}
	 */
	getRelativePath(fileName) {
		const filePath = path.join(this.buildOutputPath, fileName);

		if (!fs.existsSync(filePath)) {
			throw new Error(`Can't find file ${fileName} by path ${filePath}`);
		}

		return path.relative(this.buildOutputPath, filePath);
	}
};

