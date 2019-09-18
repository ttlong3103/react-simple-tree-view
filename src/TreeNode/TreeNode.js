import React from 'react'
import PropTypes from 'prop-types'
import './TreeNode.css'

const TreeNode = (props) => {
  const { icon, title, childNodes, isExpanded, onCollapse, onExpand } = props;
  const hasChildren = childNodes && childNodes.length > 0;
  return (
    <div className="treenode-container">
      {hasChildren && (
        <span onClick={isExpanded ? onCollapse : onExpand}>v</span>
      )}
      {icon}
      <span>{title}</span>
      {isExpanded && hasChildren && (
        <div>
          {childNodes.map((node) => {
            return <TreeNode {...node} />
          })}
        </div>
      )}
    </div>
  );
}

TreeNode.propTypes = {
  icon: PropTypes.object,
  title: PropTypes.string.isRequired,
  childNodes: PropTypes.array,
  isExpanded: PropTypes.bool,
  onExpand: PropTypes.func,
  onCollapse: PropTypes.func,
}

TreeNode.defaultProps = {
  isExpanded: false,
}

export default TreeNode