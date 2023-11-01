/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */
'use strict';

require('@config/config');

const base = include('@super/build/webpack/output', __dirname);

// eslint-disable-next-line @v4fire/require-jsdoc
module.exports = async function output({buildId}) {
	const newOutput = await base({buildId});
	const oldFileName = newOutput.filename;

	newOutput.filename = (pathData) => {
		if (pathData && pathData.runtime) {
			if (/service\.worker/.test(pathData.runtime)) {
				return '[name].js';
			}

			if (/backend\.standalone/.test(pathData.runtime)) {
				return 'backend.js';
			}
		}

		return oldFileName;
	};

	return newOutput;
};
