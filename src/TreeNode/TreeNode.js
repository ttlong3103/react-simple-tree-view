import React from 'react'
import PropTypes from 'prop-types'
import './TreeNode.css'

const TreeNode = (props) => {
  const { data, onCollapse, onExpand, onToggleSelect, path } = props;
  const { icon, title, childNodes, isExpanded, isSelected } = data;
  const hasChildren = childNodes && childNodes.length > 0;
  const styleOfSelected = isSelected ? { backgroundColor: 'yellow' } : undefined;
  return (
    <div className="treenode-container">
      {hasChildren &&
        (isExpanded ? (
          <span
            onClick={() => {
              onCollapse && onCollapse(path, { ...data, isExpanded: false });
            }}
          >
            v&nbsp;&nbsp;
          </span>
        ) : (
          <span
            onClick={() => {
              onExpand && onExpand(path, { ...data, isExpanded: true });
            }}
          >
            >&nbsp;&nbsp;
          </span>
        ))}
      {icon}
      <span
        onClick={() => {
          onToggleSelect && onToggleSelect(path, { ...data, isSelected: !isSelected });
        }}
        style={styleOfSelected}
      >
        {title}
      </span>
      {isExpanded && hasChildren && (
        <div style={{ marginLeft: '15px' }}>
          {childNodes.map((node, index) => {
            const childPath = path.concat(index);
            return (
              <TreeNode
                key={index}
                path={childPath}
                data={node}
                onExpand={onExpand}
                onCollapse={onCollapse}
                onToggleSelect={onToggleSelect}
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
    isSelected: PropTypes.bool,
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
  /**
   * Callback when select a node by clicking on its title
   * @param {Array} path - Path to this node
   * @param {Object} node - Data of this node
   */
  onToggleSelect: PropTypes.func,
}

TreeNode.defaultProps = {
  isExpanded: false,
}

export default TreeNode