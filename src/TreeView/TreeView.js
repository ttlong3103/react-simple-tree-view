import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TreeNode from '../TreeNode';

class TreeView extends Component {
  render() {
    const { data } = this.props;
    return (
      <div>
        {data.map((node) => {
          const { icon, title, childNodes, isExpanded } = node;
          return (
            <TreeNode
              icon={icon}
              title={title}
              childNodes={childNodes}
              isExpanded={isExpanded}
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
};

TreeView.defaultProps = {
  data: [],
};

export default TreeView;