/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */
'use strict';

const
	zip = require('gulp-zip'),
	path = require('path'),
	config = require('@config/config');

const
	{manifestFileName} = include('build/const');

// eslint-disable-next-line @v4fire/require-jsdoc
module.exports = function init(gulp = require('gulp')) {
	/**
	 * Создает zip архив с собранным расширением
	 */
	gulp.task('zip', () => {
		const
			id = process.env.BUILD_ID,
			buildId = id ? `-${id}` : '';

		const
			{version} = include('package.json'),
			clientOutput = config.src.clientOutput(),
			manifestPath = path.join(clientOutput, manifestFileName),
			{manifest_version: manifestVersion} = include(manifestPath);

		const
			archiveName = `v4fire-devtools-build-m${manifestVersion}-${version}${buildId}.zip`;

		// RemoveBOM: false, so that encoding doesn't break with safari-web-extension-converter
		return gulp.src(`${clientOutput}/**`, {removeBOM: false})
			.pipe(zip(archiveName))
			.pipe(gulp.dest('.'));
	});
};
