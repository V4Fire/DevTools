/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

// NOTE: this script runs in MAIN world
// @see: https://chromium.googlesource.com/chromium/src/+/master/third_party/blink/renderer/bindings/core/v8/V8BindingDesign.md#world

import * as api from '@v4fire/devtools-backend';

globalThis.__V4FIRE_DEVTOOLS_BACKEND__ = api;
