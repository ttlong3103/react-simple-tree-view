import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TreeNode from '../TreeNode';

const ERROR_UNDEFINED_VALUE = 1;
const ERROR_NULL_VALUE = 2;
const ERROR_TYPE_MISMATCH = 3;

class TreeView extends Component {
  constructor(props) {
    super(props);
    const internalTree = this._parseToInternalTree(props.initialData);
    this.state = {
      internalTree,
    };
  }

  _validateInitialData = (initialData) => {
    const type = typeof initialData;
    if (type == 'undefined') {
      throw {
        code: ERROR_UNDEFINED_VALUE,
      };
    }
    if (type == null) {
      throw {
        code: ERROR_NULL_VALUE,
        message: 'initial data can not be null',
      };
    }
    if (type == 'number' || type == 'string' || type == 'symbol') {
      throw {
        code: ERROR_TYPE_MISMATCH,
        message: `initial data can not be value of type ${type}`,
      };
    }
  };

  _parseToInternalTree = (initialData) => {
    const internalTree = {
      childrenNode: [],
    };
    // validate
    try {
      this._validateInitialData(initialData);
    } catch ({ code, message }) {
      switch (code) {
        case ERROR_UNDEFINED_VALUE: {
          initialData = [];
          break;
        }
        case ERROR_NULL_VALUE:
        case ERROR_TYPE_MISMATCH: {
          console.error(message);
          return internalTree;
        }
      }
    }
    // build queue
    const queue = [];
    for (let i = 0; i < initialData.length; i++) {
      queue.push({
        parent: internalTree,
        current: initialData[i],
        path: [i],
      });
    }
    // traverse
    while (queue.length > 0) {
      const { current, parent, path } = queue.shift();
      const clonedCurrent = { ...current, parent };

      if (clonedCurrent.childrenNode) {
        // queue children
        for (let i = 0; i < clonedCurrent.childrenNode.length; i++) {
          queue.push({
            parent: clonedCurrent,
            current: clonedCurrent.childrenNode[i],
            path: path.concat([i]),
          });
        }
        // reset children to empty array so that new children will be appended later
        clonedCurrent.childrenNode = [];
      }
      // add cloned node
      parent.childrenNode.push(clonedCurrent);
    }

    return internalTree;
  };

  /**
   * Update a node
   * @param {Object} internalTree Tree data
   * @param {Array} path Path to node
   * @returns {Object} Node data
   */
  _getNode = (internalTree, path) => {
    let runner = internalTree; // runner

    // traverse
    for (let i = 0; i < path.length; i++) {
      const index = path[i];
      runner = runner.childrenNode[index];
    }

    return runner;
  };

  /**
   * Update a node
   * @param {Object} internalTree Tree data
   * @param {Array} path Path to node
   * @param {Object} nodeData New data of node
   * @returns {Object} Updated tree
   */
  _setNode = (internalTree, path, nodeData) => {
    const updatedTree = { ...internalTree };
    let tempNode = updatedTree; // runner

    // traverse to get parent of node that need updated
    for (let i = 0, numIter = path.length - 1, index; i < numIter; i++) {
      index = path[i];
      tempNode = tempNode.childrenNode[index];
    }

    const nodeIndex = path[path.length - 1]; // index of node that need to be updated
    tempNode.childrenNode = tempNode.childrenNode.map((childNode, idx) =>
      nodeIndex === idx ? { ...childNode, ...nodeData } : childNode
    );

    return updatedTree;
  };

  /**
   * Check if 2 path are identical
   * @param {Array} path1
   * @param {Array} path2
   */
  _isSamePath = (path1, path2) => {
    if (path1.length == path2.length) {
      for (let i = 0; i < path1.length; i++) {
        if (path1[i] !== path2[i]) {
          return false;
        }
      }
      return true;
    }
    return false;
  };

  /**
   * Traverse tree and invoke callback on each node
   * @param {Array} tree Tree data
   * @param {Function} callback function invoked on each node: `(current, path, parent) => any`
   */
  _traverse = (tree, callback) => {
    const queue = [];
    const invokeCallbackQueue = [];
    // build queue
    const tempRoot = { ...tree };
    queue.push({
      parent: null,
      current: tempRoot,
      path: [],
    });
    // traverse
    while (queue.length > 0) {
      const { current, parent, path } = queue.shift();
      invokeCallbackQueue.push({
        parent,
        current,
        path
      });
      if (current.childrenNode) {
        // queue children
        for (let i = 0; i < current.childrenNode.length; i++) {
          queue.push({
            parent: current,
            current: current.childrenNode[i],
            path: path.concat([i]),
          });
        }
      }
    }

    // invoke callback on each node
    // we do not invoke when traverse with $queue to prevent accidentally changing value of reference
    // the complexity will be 2n but it's worthy
    for(let i = 0, numIter = invokeCallbackQueue.length; i < numIter; i++) {
      callback(invokeCallbackQueue[i].current, invokeCallbackQueue[i].path, invokeCallbackQueue[i].parent);
    }
  };

  _onCollapseNode = (path, node) => {
    // const { onCollapse, data: treeData } = this.props;
    const { onCollapse } = this.props;

    this.setState((state) => {
      const { internalTree } = state;
      const updatedTree = this._setNode(internalTree, path, node);
      if (onCollapse) {
        onCollapse({ path, node }, updatedTree.childrenNode);
      }
      return {
        internalTree: updatedTree,
      };
    });
  };

  _onExpandNode = (path, node) => {
    // const { onExpand, data: treeData } = this.props;
    const { onExpand } = this.props;

    this.setState((state) => {
      const { internalTree } = state;
      const updatedTree = this._setNode(internalTree, path, node);
      if (onExpand) {
        onExpand({ path, node }, updatedTree.childrenNode);
      }
      return {
        internalTree: updatedTree,
      };
    });
  };

  _onToggleSelectNode = (e, path, node) => {
    const { onToggleSelect, data: treeData } = this.props;
    const isPressingCtrlKey = e.ctrlKey;

    this.setState(state => {
      let updatedTree;
      if (isPressingCtrlKey) {
        // user is pressing CTRL, this means multi-select
        updatedTree = this._setNode(state.internalTree, path, node);
      } else {
        // single select: select a node will deselect others
        updatedTree = { ...state.internalTree };
        this._traverse(
          updatedTree,
          (nodeData, nodePath) => {
            if (this._isSamePath(path, nodePath)) {
              nodeData.isSelected = true
            } else {
              nodeData.isSelected = false
            }
          }
        );
      }
      if (onToggleSelect) {
        onToggleSelect({ path, node }, updatedTree.childrenNode);
      }
      return {
        internalTree: updatedTree
      }
    })
  };

  render() {
    // const { data } = this.props;
    const data = this.state.internalTree.childrenNode;
    return (
      <div>
        {data.map((node, index) => {
          const path = [index];
          return (
            <TreeNode
              key={index}
              path={path}
              data={node}
              onExpand={this._onExpandNode}
              onCollapse={this._onCollapseNode}
              onToggleSelect={this._onToggleSelectNode}
            />
          );
        })}
      </div>
    );
  }
}

TreeView.propTypes = {
  initialData: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node,
      title: PropTypes.string.isRequired,
      childrenNode: PropTypes.array,
      isExpanded: PropTypes.bool,
      isSelected: PropTypes.bool,
    })
  ),

  data: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node,
      title: PropTypes.string.isRequired,
      childrenNode: PropTypes.array,
      isExpanded: PropTypes.bool,
      isSelected: PropTypes.bool,
    })
  ),

  /**
   * Callback when select a tree node
   * `(fromNode, newTree) => any`
   * @param {Object} fromNode Data of node that trigger this callback
   * - path: Array - Path to selected node
   * - node: Object - Data of selected node
   * @param {Object} newTree - Updated tree
   */
  onToggleSelect: PropTypes.func,

  /**
   * Callback when expand a parent node by clicking expand indicator
   * `(fromNode, newTree) => any`
   * @param {Object} fromNode Data of node that trigger this callback
   * - path: Array - Path to expanded node
   * - node: Object - Data of expanded node
   * @param {Object} newTree - Updated tree
   */
  onExpand: PropTypes.func,

  /**
   * Callback when collapse a parent node by clicking collapse indicator
   * `(fromNode, newTree) => any`
   * @param {Object} fromNode Data of node that trigger this callback
   * - path: Array - Path to collapsed node
   * - node: Object - Data of collapsed node
   * @param {Object} newTree - Updated tree
   */
  onCollapse: PropTypes.func,
};

TreeView.defaultProps = {
  data: [],
  initialData: [],
};

export default TreeView;
