# react-simple-tree-view

> A React tree view library

[![NPM](https://img.shields.io/npm/v/react-simple-tree-view.svg)](https://www.npmjs.com/package/react-simple-tree-view) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-simple-tree-view
```

## Usage

```jsx
import React, { Component } from 'react'

import MyComponent from 'react-simple-tree-view'

class Example extends Component {
  render () {
    return (
      <MyComponent />
    )
  }
}
```

## API

Name | Type | Default | Description
--- | --- | --- | ---
initialData | Array | [] | Array of nodes to initalize tree. Each node has form:<br>{<br>&nbsp;&nbsp;icon: Component<br>&nbsp;&nbsp;title: String<br>&nbsp;&nbsp;childrenNode: Array<br>&nbsp;&nbsp;isExpanded: Boolean<br>&nbsp;&nbsp;isSelected: Boolean<br>&nbsp;&nbsp;...yourExtraData<br>}
indentChild | Number | 30 | Indentation of children node compares to its folder parent
selectionBackColor | String | <div style="width:10px; height:10px; background-color:#257AFD"></div>#257AFD | Background color of selected node
onClickNode | Function | | Callback when click a tree node<br>`(e, { path, node }, newTree) => any`<br>- e (Object) : Event data<br>- path (Array) : Path to node<br>- node (Object) : Data of node<br>- newTree (Object) : Updated tree
onExpandNode | Function | | Callback when expand a parent node by clicking expand indicator<br>`({ path, node }, newTree) => any`<br>- path (Array) : Path to node<br>- node (Object) : Data of node<br>- newTree (Object) : Updated tree
onCollapseNode | Function | | Callback when collapse a parent node by clicking collapse indicator<br>`({ path, node }, newTree) => any`<br>- path (Array) : Path to node<br>- node (Object) : Data of node<br>- newTree (Object) : Updated tree

## License

MIT © [ttlong3103](https://github.com/ttlong3103)

## Contribute

1. Clone this repository
2. At root of repo, run `npm start`
3. Open another command-line, cd to folder `example` of this repo. At there, run `npm start`