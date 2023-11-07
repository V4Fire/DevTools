/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

/**
 * Extension manifest version
 */
export const manifestVersion = chrome.runtime.getManifest().manifest_version;

export const isManifestV2 = manifestVersion === 2;

export const browserAPI = isManifestV2 ? browser : chrome;

export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
