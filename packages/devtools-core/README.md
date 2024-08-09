# V4Fire DevTools Core <!-- omit in toc -->

This is the source code for the V4Fire DevTools application which can be used
as the browser extension or standalone app.

The application must be written in an isomorphic way, it must not depend on any
exclusive APIs', such as: `chrome.runtime`, `chrome.devtools`, etc.

## Table of contents <!-- omit in toc -->

- [Quick Start](#quick-start)
- [Interaction with the inspected application](#interaction-with-the-inspected-application)

## Quick Start

1. Run at the root `yarn install`
2. `cd ./packages/v4fire-devtools-core`
3. `yarn dev`
4. Open new terminal and run `yarn start`
5. Open browser at `http://localhost:3333`

## Interaction with the inspected application

```mermaid
classDiagram
  direction TB
  %% V4Fire Types
  class ComponentInterface
  <<interface>>ComponentInterface

  %% Devtools Types
  class ComponentData {
    string componentId
    string componentName
    Dictionary values
    string[] hierarchy
    %% other props are omitted
  }

  class DevtoolsHandle~Target~ {
    -Nullable~string~ id
    evaluate~T~((Target ctx) => T) Promise~T~
    dispose() Promise~void~
  }

  class ComponentHandle~ComponentInterface~ {
    highlight(boolean autoHide) void
    getData() Promise~ComponentData~
    setMod(string key, string value) Promise~boolean~
    subscribe(Function callback) Function
  }

  ComponentHandle o-- ComponentInterface
  ComponentHandle --|> DevtoolsHandle
  ComponentHandle o-- ComponentData

  class TreeItem {
    string value
    string label
    string componentName
    number renderCounterProp
    boolean isFunctionalProp
    TreeItem[] children
  }

  class InspectedApp {
    Components components
  }
  <<interface>> InspectedApp

  class Components {
    tree() Promise~TreeItem[]~
  }

  Components o-- TreeItem
  InspectedApp *-- Components
```
