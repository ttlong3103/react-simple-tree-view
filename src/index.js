import React, { Component } from 'react';
import TreeView from './TreeView';
import Folder from './icon/folder.svg'
import File from './icon/file.svg'

const styleOfFile = { marginLeft: '0px', marginRight: '5px' };
const styleOfFolder = { marginLeft: '5px' };


function FolderIcon () {
  return <img src={Folder} width={18} height={18} />;
};
function FileIcon () {
  return <img src={File} width={15} height={15} />;
};


const treeData = [
  {
    icon: <FolderIcon />,
    title: 'folder1',
    childNodes: ['readme.md', 'test.js'].map((x) => ({
      icon: <FileIcon />,
      title: x,
    })),
  },
  {
    icon: <FolderIcon />,
    title: 'folder2',
    childNodes: ['a.css', 'b.js', 'c.txt'].map((x) => ({
      icon: <FileIcon />,
      title: x,
    })),
    isExpanded: true,
  },
  {
    icon: <FileIcon />,
    title: 'index.js',
  },
  {
    icon: <FolderIcon />,
    title: 'folder3',
    childNodes: [
      {
        icon: <FileIcon />,
        title: 'index.js',
      },
      {
        icon: <FolderIcon />,
        title: 'components',
        // isExpanded: true,
        childNodes: [
          {
            icon: <FileIcon />,
            title: 'abc',
          },
          {
            icon: <FolderIcon />,
            title: 'xyz',
            isExpanded: true,
            childNodes: ['1', '2', '3'].map((x) => ({ icon: <FileIcon />, title: x })),
          },
        ],
      },
    ],
    isExpanded: true,
  },
];

export default class ExampleComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData,
    };
  }

  _onExpandNode = (_, updatedTree) => {
    this.setState({
      treeData: updatedTree
    })
  };

  _onCollapseNode = (_, updatedTree) => {
    this.setState({
      treeData: updatedTree
    })
  };

  _onToggleSelectNode = (_, updatedTree) => {
    this.setState({
      treeData: updatedTree
    })
  };

  render() {
    return (
      <div>
        <TreeView
          data={this.state.treeData}
          onExpand={this._onExpandNode}
          onCollapse={this._onCollapseNode}
          onToggleSelect={this._onToggleSelectNode}
        />
      </div>
    );
  }
}
