import React from 'react'
import PropTypes from 'prop-types'
import ArrowDown from '../icon/arrow-down.svg'
import ArrowRight from '../icon/arrow-right.svg'
import Css from './TreeNode.css'

function ExpandIcon() {
  return  <img src={ArrowDown} width={15} height={15} />;
};
function CollapseIcon () {
  return <img src={ArrowRight} width={15} height={15} />;
};

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
            <ExpandIcon />
          </span>
        ) : (
          <span
            onClick={() => {
              onExpand && onExpand(path, { ...data, isExpanded: true });
            }}
          >
            <CollapseIcon/>
          </span>
        ))
      }
      {icon}
      <span className= {Css["short-text"]}
        onClick={(e) => {
          onToggleSelect && onToggleSelect(e, path, { ...data, isSelected: !isSelected });
        }}
        style={styleOfSelected}
      >
        {title}
      </span>
      {isExpanded && hasChildren && (
        <div style={{ marginLeft: '30px' }}>
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
   * @param {Object} event - Click event
   * @param {Array} path - Path to this node
   * @param {Object} node - Data of this node
   */
  onToggleSelect: PropTypes.func,
}

TreeNode.defaultProps = {
  isExpanded: false,
}

export default TreeNode
