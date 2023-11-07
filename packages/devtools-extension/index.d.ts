/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

/* eslint-disable no-var */

/// <reference types="@v4fire/devtools-core"/>

declare const
	browser: typeof chrome;

/**
 * Devtools backend API - available only in the inspected window context
 */
declare var __V4FIRE_DEVTOOLS_BACKEND__: typeof import('@v4fire/devtools-backend');
