# components/directives/highlight

This directive allows to search for a child in context of a component or page
without disclosing the state of the parent component to the children components.

## Usage

This directive should be added to regular element:

```ss
/// b-some-component.ss
< div v-highlight = {text: label, id: componentId}
  {{ text }}
```

To enable search check the [`iSearch`](../../traits/i-search) trait.

## Directive params

Required:

- `text` - text which should be highlighted

Optional:

- `id` - unique id of the node in the specified context

