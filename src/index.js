import React, { Component } from 'react';
import TreeView from './TreeView';
import Folder from './icon/folder.svg'
import File from './icon/file.svg'

const styleOfFile = { marginLeft: '0px', marginRight: '5px' };
const styleOfFolder = { marginLeft: '5px', marginRight: '5px' };


function FolderIcon () {
  return <img style={styleOfFolder} src={Folder} width={18} height={18} />;
};
function FileIcon () {
  return <img style={styleOfFile} src={File} width={15} height={15} />;
};


const treeData = [
  {
    icon: <FolderIcon />,
    title: 'folder1 folder1 folder1 folder1 folder1 folder1 folder1 folder1 folder1',
    childrenNode: ['readme.md', 'test.js'].map((x) => ({
      icon: <FileIcon />,
      title: x,
    })),
  },
  {
    icon: <FolderIcon />,
    title: 'folder2',
    childrenNode: ['a.css', 'b.js', 'c.txt'].map((x) => ({
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
    childrenNode: [
      {
        icon: <FileIcon />,
        title: 'index.js',
      },
      {
        icon: <FolderIcon />,
        title: 'components',
        // isExpanded: true,
        childrenNode: [
          {
            icon: <FileIcon />,
            title: 'abc',
          },
          {
            icon: <FolderIcon />,
            title: 'xyz',
            isExpanded: true,
            childrenNode: ['1', '2', '3'].map((x) => ({ icon: <FileIcon />, title: x })),
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
    
  };

  _onCollapseNode = (_, updatedTree) => {
    
  };

  _onToggleSelectNode = (_, updatedTree) => {
    
  };

  render() {
    return (
      <div style={{backgroundColor: '#e5e5e5', width: 300}}>
        <TreeView
          initialData={this.state.treeData}
          onExpand={this._onExpandNode}
          onCollapse={this._onCollapseNode}
          onToggleSelect={this._onToggleSelectNode}
        />
      </div>
    );
  }
}
