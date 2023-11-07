# serialize

This module is used to serialize complex values.
It is mainly used to serialize component's meta and send it to the devtools.

## API

### serialize

Serializes the given value:

```ts
import { serialize } from '@v4fire/devtools-backend';

serialize({date: new Date(), set: new Set([1,2,3]), sum: (a, b) => a + b})

// NOTE: the result was formatted for the example
// {
//   "date": "2023-11-01T12:31:56.859Z",
//   "set": {
//     "__DATA__": "__DATA__:Set",
//     "__DATA__:Set": [
//       1,
//       2,
//       3
//     ]
//   },
//   "sum": {
//     "__DATA__": "__DATA__:Function",
//     "__DATA__:Function": "(a, b) => a + b"
//   }
// }
```

### deserialize

Deserializes previously serialized value:

```ts
import { deserialize } from '@v4fire/devtools-backend';

deserialize('{"set":{"__DATA__":"__DATA__:Set","__DATA__:Set":[1,2,3]}}') // {set: Set(3)}
```
