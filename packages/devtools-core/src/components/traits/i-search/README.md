## components/traits/i-search

This trait provides a search API for any component.

## Usage

```ts
import Search, { SearchDirection, SearchMatch } from 'components/traits/i-search/search';
import iSearch from 'components/traits/i-search/i-search';

interface Item {
  value: string;
  label: string;
}

interface bSomeComponent extends Trait<typeof iSearch> {}

@component()
@derive(iSearch)
class bSomeComponent extends iBlock implements iSearch<Item> {
  /** {@link iSearch.searchEntryIndex} */
  @field()
  searchEntryIndex: number = -1;

  /** {@link iSearch.searchMatchCount} */
  @field()
  searchMatchCount: number = 0;

  /** {@link iSearch.search} */
  @system<iSearch>((ctx) => new Search<Item>(
    ctx,
    // `getSearchable` - returns searchable text for the item
    (item) => item.label,
    // `getId` - returns id of the item (optional)
    (item) => item.value
  ))

  search!: Search<Item>;

  watchInputChanged(value: string) {
    // All items will be automatically highlighted
    this.search.update(value);
  }
}
```

**Important** Your items must be marked with [`v-highlight`](../../directives/highlight) directive.

Also, it's possible to set `searchMatches` manually, but the `getId` must be specified
in the search engine constructor:

```ts
const items = [{value: '1', label: 'text 1'}, {value: '2', label: 'text 2'}];
const shouldNotify = false;
const matches = [];

// Update the search query
this.search.update('text 1', shouldNotify);

// Find all matches
items.forEach((item) => {
  const indices = this.search.match(item);

  if (!indices.some((x) => x === -1)) {
    matches.push({item, indices});
  }
});

// Set matches to the search engine
this.search.setMatches(matches);
```

## Events

All events are emitted to the `localEmitter` of the component.

| EventName                   | Description                                           | Payload description                         | Payload            |
|-----------------------------|-------------------------------------------------------|---------------------------------------------|--------------------|
| `highlight.{id}`            | Add/remove highlight from node with given ID          | Start and stop index of matching substring  | `[number, number]` |
| `highlight-reset`           | Remove highlight from all nodes in specified context  | -                                           | -                  |
| `highlight`                 | Highlight event with new `matchQuery`                 | Match query                                 | `RegExp \| string` |
| `highlight.current.{id}`    | Add/remove mark from node as currently selected       | -                                           | `boolean`          |
