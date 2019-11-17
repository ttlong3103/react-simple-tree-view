import React, { Component } from 'react';

import TreeView from 'react-simple-tree-view';
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
		title:
			'This is a folder that has really really really really really really long name',
		childrenNode: ['README.md', '_test_.js'].map((x) => ({
			icon: <FileIcon />,
			title: x,
		})),
	},
	{
		icon: <FolderIcon />,
		title: 'folder A',
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
		title: 'folder B',
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
						title: 'Button.js',
					},
					{
						icon: <FolderIcon />,
						title: 'TextInput',
						isExpanded: true,
						childrenNode: [
							'InputNumber.js',
							'InputDate.js',
							'Input.js',
						].map((x) => ({ icon: <FileIcon />, title: x })),
					},
				],
			},
		],
		isExpanded: true,
	},
];

export default class App extends Component {
	state = {
		history: [],
	};
	addHistory = (text) => {
		this.setState((state) => {
			return {
				history: state.history.concat('- ' + text),
			};
		});
	};
	onExpandNode = ({ node }, updatedTree) => {
		this.addHistory('You expanded ' + node.title);
	};

	onCollapseNode = ({ node }, updatedTree) => {
		this.addHistory('You collapsed ' + node.title);
	};

	onClickNode = (e, { node }, updatedTree) => {
		this.addHistory('You clicked ' + node.title);
	};
	render() {
		return (
			<div style={{ display: 'flex' }}>
				<TreeView
					initialData={treeData}
					onExpandNode={this.onExpandNode}
					onCollapseNode={this.onCollapseNode}
					onClickNode={this.onClickNode}
					style={{
						backgroundColor: '#e5e5e5',
						width: 300,
						height: window.innerHeight,
					}}
				/>
				<div style={{ margin: 50 }}>{this.state.history.map(t => <div>{t}</div>)}</div>
			</div>
		);
	}
}
