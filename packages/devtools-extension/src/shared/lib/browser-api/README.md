# Browser API

This module exports `browserAPI` variable - a global namespace containing various methods to
interact with the browser.

_Disclaimer: When calling specific methods you should check the support and signature_
_in different versions of the extension manifest and the browser._

All browsers support the `chrome` namespace, but in the second version of the extension manifest
some methods accept callbacks instead of returning a `Promise`.

In this case the `browser` namespace will be used for `firefox` and `safari`,
which provides relatively uniform signatures of methods in different versions of the extension manifest.
