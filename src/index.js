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
        childNodes: [
          {
            title: 'abc',
          },
          {
            title: 'xyz',
            isExpanded: true,
            childNodes: ['1', '2', '3'].map((x) => ({ ttile: x })),
          },
        ],
      },
    ],
    isExpanded: true,
  },
];

export default class ExampleComponent extends Component {
  render() {
    return (
      <div>
        <TreeView data={treeData} />
      </div>
    );
  }
}
