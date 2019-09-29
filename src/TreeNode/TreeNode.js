import React from 'react'
import PropTypes from 'prop-types'
import './TreeNode.css'

const TreeNode = (props) => {
  const { icon, title, childNodes, isExpanded, onCollapse, onExpand, onSelect, path } = props;
  console.log('path', path)
  const hasChildren = childNodes && childNodes.length > 0;
  return (
    <div className="treenode-container">
      {hasChildren &&
        (isExpanded ? (
          <span onClick={onCollapse}>v</span>
        ) : (
          <span onClick={onExpand}>></span>
        ))}
      {icon}
      <span onClick={onSelect}>{title}</span>
      {isExpanded && hasChildren && (
        <div>
          {childNodes.map((node, index) => {
            const { icon, title, childNodes, isExpanded } = node;
            const childPath = path.concat(index);
            return (
              <TreeNode
                key={index}
                path={childPath}
                icon={icon}
                title={title}
                childNodes={childNodes}
                isExpanded={isExpanded}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

TreeNode.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  childNodes: PropTypes.array,
  isExpanded: PropTypes.bool,
  onExpand: PropTypes.func,
  onCollapse: PropTypes.func,
  onSelect: PropTypes.func,
}

TreeNode.defaultProps = {
  isExpanded: false,
}

export default TreeNode