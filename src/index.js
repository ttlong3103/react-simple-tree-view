import React, { Component } from 'react';
import TreeView from './TreeView';

const treeData = [
  {
    title: 'folder1',
    childNodes: ['readme.md', 'test.js'].map((x) => ({
      title: x,
    })),
  },
  {
    title: 'folder2',
    childNodes: ['a.css', 'b.js', 'c.txt'].map((x) => ({
      title: x,
    })),
    isExpanded: true,
  },
  {
    title: 'index.js',
  },
  {
    title: 'folder3',
    childNodes: [
      {
        title: 'index.js',
      },
      {
        title: 'components',
        // isExpanded: true,
        childNodes: [
          {
            title: 'abc',
          },
          {
            title: 'xyz',
            isExpanded: true,
            childNodes: ['1', '2', '3'].map((x) => ({ title: x })),
          },
        ],
      },
    ],
    isExpanded: true,
  },
];

function getNode(root, path) {
  let result = root;
  for (let i = 0; i < path.length; i++) {
    const index = path[i];
    result[index];
  }
  return result;
}
function setNode(root, path, data) {
  let node = root;
  for (let i = 0; i < path.length - 1; i++) {
    const index = path[i];
    node[index];
  }
  node[path.length - 1] = data;
}

export default class ExampleComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData,
    };
  }

  _onExpandNode = (path, nodeData) => {
    setNode(this.state.treeData, path, nodeData);
    this.setState(this.state.treeData);
  };

  _onCollapseNode = (path, nodeData) => {
    setNode(this.state.treeData, path, nodeData);
    this.setState(this.state.treeData);
  };

  render() {
    return (
      <div>
        <TreeView
          data={this.state.treeData}
          onExpand={this._onExpandNode}
          onCollapse={this._onCollapseNode}
        />
      </div>
    );
  }
}
