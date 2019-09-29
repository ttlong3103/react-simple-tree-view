import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TreeNode from '../TreeNode';

class TreeView extends Component {
  render() {
    const { data, onExpand, onCollapse } = this.props;
    return (
      <div>
        {data.map((node, index) => {
          const { icon, title, childNodes, isExpanded } = node;
          const path = [index];
          return (
            <TreeNode
              key={index}
              path={path}
              data={{
                icon,
                title,
                childNodes,
                isExpanded,
              }}
              onExpand={onExpand}
              onCollapse={onCollapse}
            />
          );
        })}
      </div>
    );
  }
}

TreeView.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node,
      title: PropTypes.string.isRequired,
      childNodes: PropTypes.array,
      isExpanded: PropTypes.bool,
    })
  ),
  /**
   * Callback when select a tree node
   * @param {Array} path - Path to selected node
   * @param {Object} node - Data of selected node
   */
  onSelect: PropTypes.func,
  /**
   * Callback when expand a parent node by clicking expand indicator
   * @param {Array} path - Path to this node
   * @param {Object} node - Data of this node
   * @param {Object} tree - Data of current tree
   */
  onExpand: PropTypes.func,
  /**
   * Callback when collapse a parent node by clicking collapse indicator
   * @param {Array} path - Path to this node
   * @param {Object} node - Data of this node
   * @param {Object} tree - Data of current tree
   */
  onCollapse: PropTypes.func,
};

TreeView.defaultProps = {
  data: [],
};

export default TreeView;
