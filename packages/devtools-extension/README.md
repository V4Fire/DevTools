# V4Fire DevTools Extension

This is the source code for the V4Fire DevTools browser extension.

## Quick start

1. Run at the root `yarn install`
2. `cd ./packages/devtools-extension`
3. `yarn dev`

Install extension:

1. Open in browser [browser://extensions/](browser://extensions/)
or [chrome://extensions/](chrome://extensions/)
2. Enable `Developer mode`
3. Press `Load unpacked` button, find your project and select `./dist/client` directory.
Extension should appear in your extensions list.
4. Open any site using the V4Fire, open browser devtools:
there should be a tab named `V4Fire`.

## Build and deploy

1. Run `yarn build:store`
2. `zip` file will be created
3. Upload the zip file `Chrome Web Store`, following
the [guide](https://developer.chrome.com/docs/webstore/publish)

P.s. it's recommended to add a build id, for example:
`BUILD_ID=20231212 yarn build:store`
