/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import type { StaticRoutes } from 'components/base/b-router/b-router';

export default <StaticRoutes>{
	components: {
		component: 'p-components',
		default: true
	},
	profiler: {
		component: 'p-profiler'
	}
};
