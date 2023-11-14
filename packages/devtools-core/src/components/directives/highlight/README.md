# components/directives/highlight

This directive should be added to regular element:

```ss
/// b-some-component.ss
< div v-highlight = {text: label, id: componentId, ctx: 'global-search'}
  {{ text }}
```

In a parent component emit `highlight` through `globalEmitter`:

```ts
// Context must be specified
this.globalEmitter.emit('highlight:global-search', /search/i);
```

or you can manually highlight specific search matches by their id:

```ts
import { matchText } from 'components/directives/highlight/helpers';

// Assume a child:
// < b-some-component :componentId = 'unique-id' | :label = 'Search me'

const prevChild: bSomeComponent = // previous matches can be stored;
const child: bSomeComponent = // somehow get the child;

const matchIndices = matchText(child.label, /search/i); // [0, 6]

this.globalEmitter.emit(`highlight:global-search:${child.componentId}`, matchIndices);

// Reset the highlight of the previous match
this.globalEmitter.emit(`highlight:global-search:${prevChild.componentId}`, null);
```

to reset highlight for all elements emit special event:

```ts
this.globalEmitter.emit(`highlight:global-search:reset`);
```
