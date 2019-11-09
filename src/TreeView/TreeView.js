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
      internalTree
    }
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
      const clonedCurrent = { ...current };

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
   * @param {Array} treeData - Provided tree data props
   * @param {Array} path - Path to node
   * @param {Object} nodeData - New data of node
   * @returns {Array} Updated tree
   */
  _setNode = (treeData, path, nodeData) => {
    const tempRoot = {
      childrenNode: treeData,
    };
    let tempNode = tempRoot; // runner
    let parentNode = null; // hold parent

    // traverse and build new tree
    let i = 0;
    for (; i < path.length - 1; i++) {
      const index = path[i];
      parentNode = tempNode;
      parentNode.childrenNode = [...parentNode.childrenNode]; // clone new childrenNode
      tempNode = { ...parentNode.childrenNode[index] }; // create new node
      parentNode.childrenNode[index] = tempNode; // replace old node with newly created node
    }

    const nodeIndex = path[i];
    tempNode.childrenNode = tempNode.childrenNode.map((childNode, idx) =>
      nodeIndex === idx ? nodeData : childNode
    );

    return tempRoot.childrenNode;
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
   * Traverse tree and update each node with update function
   * @param {Array} treeData - Provided tree data props
   * @param {Function} updater - Update function apply to each node: `(current, path) => updated`
   * @returns {Array} Updated tree
   */
  _updateNodes = (treeData, updater) => {
    const queue = [];
    // build queue
    const tempRoot = {
      childrenNode: [],
    };
    for (let i = 0; i < treeData.length; i++) {
      queue.push({
        parent: tempRoot,
        current: treeData[i],
        path: [i],
      });
    }
    // traverse and update
    while (queue.length > 0) {
      const { current, parent, path } = queue.shift();
      // update node
      const updated = updater(current, path);
      if (updated.childrenNode) {
        // queue children
        for (let i = 0; i < updated.childrenNode.length; i++) {
          queue.push({
            parent: updated,
            current: updated.childrenNode[i],
            path: path.concat([i]),
          });
        }
        // make old children empty so that new children will be appended later
        updated.childrenNode = [];
      }
      // append this updated node to its parent
      parent.childrenNode.push(updated);
    }

    return tempRoot.childrenNode;
  };

  _onCollapseNode = (path, node) => {
    const { onCollapse, data: treeData } = this.props;
    if (onCollapse) {
      const updatedTree = this._setNode(treeData, path, node);
      onCollapse({ path, node }, updatedTree);
    }
  };

  _onExpandNode = (path, node) => {
    const { onExpand, data: treeData } = this.props;
    if (onExpand) {
      const updatedTree = this._setNode(treeData, path, node);
      onExpand({ path, node }, updatedTree);
    }
  };

  _onToggleSelectNode = (e, path, node) => {
    const { onToggleSelect, data: treeData } = this.props;
    if (onToggleSelect) {
      if (e.ctrlKey) {
        // user is pressing CTRL, this means multi-select
        const updatedTree = this._setNode(treeData, path, node);
        onToggleSelect({ path, node }, updatedTree);
      } else {
        // single select: select a node will deselect others
        const updatedTree = this._updateNodes(
          treeData,
          (nodeData, nodePath) => {
            if (this._isSamePath(path, nodePath)) {
              return {
                ...nodeData,
                isSelected: node.isSelected,
              };
            } else {
              return {
                ...nodeData,
                isSelected: false,
              };
            }
          }
        );
        onToggleSelect({ path, node }, updatedTree);
      }
    }
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
