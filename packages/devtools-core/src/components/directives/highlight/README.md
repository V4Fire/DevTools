# components/directives/highlight

This directive allows to search for a child in context of a component or page
without disclosing the state of the parent component to the children components.

## Usage

This directive should be added to regular element:

```ss
/// b-some-component.ss
< div v-highlight = {text: label, id: componentId, ctx: 'global-search'}
  {{ text }}
```

In a parent component emit `highlight` event through `globalEmitter`:

```ts
// Note that the context is specified to `global-search`
this.globalEmitter.emit('highlight:global-search', /search/i);
```

or you can manually highlight specific search matches by their ID:

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

to reset highlight for all elements emit the reset event:

```ts
this.globalEmitter.emit(`highlight:global-search:reset`);
```

## Directive params

Required:

- `text` - text which should be highlighted
- `ctx` - context of the highlight: usually a component name

Optional:

- `id` - unique id of the node in the specified context
- `emitter` - event emitter to listen for highlight events

## Events

| EventName                 | Description                                           | Payload description                         | Payload            |
|---------------------------|-------------------------------------------------------|---------------------------------------------|--------------------|
| `highlight:{ctx}:{id}`    | Add/remove highlight from node with given ID          | Start and stop index of matching substring  | `[number, number]` |
| `highlight:{ctx}:reset`   | Remove highlight from all nodes in specified context  | -                                           | -                  |
| `highlight:{ctx}`         | Highlight event with new `matchQuery`                 | Match query                                 | `RegExp \| string` |
