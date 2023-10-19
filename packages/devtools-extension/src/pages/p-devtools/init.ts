/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import Async from '@v4fire/core/core/async';
import { browserAPI } from 'shared/lib';
import { CouldNotFindV4FireOnThePageError, detectV4Fire } from 'pages/p-devtools/modules/detect-v4fire';

const $a = new Async();

/**
 * Detection promise - it will resolve when v4fire has loaded
 */
let detectV4FirePromise: Promise<void> | null = null;

/**
 * Root element in the devtools panel
 */
let root: Element | null = null;

/**
 * Equal to `true` when navigation has occurred
 */
let shouldUpdateRoot = false;

// Init
(() => {
	// In case when multiple navigation events emitted in a short period of time.
	// This debounced callback primarily used to avoid mounting V4Fire DevTools multiple times.
	const debouncedOnNavigatedListener = $a.debounce(() => {
		performInTabNavigationCleanup();
		mountDevToolsWhenV4FireHasLoaded();
	}, 500);

	// Cleanup previous page state and remount everything on navigation
	browserAPI.devtools.network.onNavigated.addListener(debouncedOnNavigatedListener);

	// Try to mount devtools
	mountDevToolsWhenV4FireHasLoaded();
})();

/**
 * Mounts devtools when v4fire has loaded
 */
function mountDevToolsWhenV4FireHasLoaded() {
	const mount = () => {
		browserAPI.devtools.panels.create(
			'V4Fire',
			'assets/icons/enabled/128.png',
			'p-root.html',
			(panel) => {
				panel.onShown.addListener((panelWindow) => {
					root = panelWindow.document.getElementById('root-component');
				});
			}
		);

		if (shouldUpdateRoot) {
			// TODO: re-render root
			shouldUpdateRoot = false;
		}
	};

	// Max attempts - 5
	detectV4FirePromise = $a.promise(detectV4Fire(5));

	detectV4FirePromise
		.then(mount)
		.catch((error) => {
			if (error instanceof CouldNotFindV4FireOnThePageError) {
				setRootPlaceholder('Looks like this page doesn\'t have V4Fire, or it hasn\'t been loaded yet.');
			} else {
				// eslint-disable-next-line no-console
				console.error(error);
			}
		});
}

/**
 * Cleanups devtools state when navigation in tab has occurred
 */
function performInTabNavigationCleanup() {
	if (detectV4FirePromise != null) {
		$a.cancelPromise(detectV4FirePromise);
	}

	setRootPlaceholder('Loading...');

	shouldUpdateRoot = true;
}

/**
 * Sets a placeholder for the root element.
 * It's useful in scenarios when page is loading or V4Fire was not found on the page.
 *
 * @param text
 */
function setRootPlaceholder(text: string) {
	if (root != null) {
		root.innerHTML = `<h1 style="font-family: monospace;">${text}</h1>`;
	}
}
