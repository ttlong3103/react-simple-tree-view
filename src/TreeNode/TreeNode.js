import React from 'react'
import PropTypes from 'prop-types'
import './TreeNode.css'

const TreeNode = (props) => {
  const { data, onCollapse, onExpand, onSelect, path } = props;
  const { icon, title, childNodes, isExpanded } = data;
  const hasChildren = childNodes && childNodes.length > 0;
  return (
    <div className="treenode-container">
      {hasChildren &&
        (isExpanded ? (
          <span
            onClick={() => {
              onCollapse && onCollapse(path, { ...data, isExpanded: false });
            }}
          >
            v
          </span>
        ) : (
          <span
            onClick={() => {
              onExpand && onExpand(path, { ...data, isExpanded: true });
            }}
          >
            >
          </span>
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
      )}
    </div>
  );
}

TreeNode.propTypes = {
  data: PropTypes.shape({
    icon: PropTypes.node,
    title: PropTypes.string.isRequired,
    childNodes: PropTypes.array,
    isExpanded: PropTypes.bool,
  }),
  /**
   * Callback when expand a parent node by clicking expand indicator
   * @param {Array} path - Path to this node
   * @param {Object} node - Data of this node
   */
  onExpand: PropTypes.func,
  /**
   * Callback when collapse a parent node by clicking collapse indicator
   * @param {Array} path - Path to this node
   * @param {Object} node - Data of this node
   */
  onCollapse: PropTypes.func,
  onSelect: PropTypes.func,
}

TreeNode.defaultProps = {
  isExpanded: false,
}

export default TreeNode