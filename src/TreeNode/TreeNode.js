import React from 'react';
import PropTypes from 'prop-types';
import ArrowDown from '../icon/arrow-down.svg';
import ArrowRight from '../icon/arrow-right.svg';
import css from './TreeNode.css';

function ExpandIcon() {
  return <img src={ArrowDown} width={15} height={15} />;
}
function CollapseIcon() {
  return <img src={ArrowRight} width={15} height={15} />;
}

const TreeNode = (props) => {
  const {
    data,
    onCollapse,
    onExpand,
    onToggleSelect,
    path,
    indentChild,
    selectionBackColor
  } = props;
  const renderRow = (data, indentation, path) => {
    const { icon, title, childrenNode, isExpanded, isSelected } = data;
    const hasChildren = childrenNode && childrenNode.length > 0;
    const styleOfSelected = isSelected
      ? { backgroundColor: selectionBackColor }
      : undefined;
    return (
      <div className={css['treenode']} key={path} style={{ width: '100%', ...styleOfSelected }}>
        <div style={{ marginLeft: indentation }}>
          {hasChildren &&
            (isExpanded ? (
              <span
                onClick={() => {
                  onCollapse &&
                    onCollapse(path, { ...data, isExpanded: false });
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
                <CollapseIcon />
              </span>
            ))}
          {icon}
          <span
            className={`${css['short-text']} ${css['none-selectable-text']}`}
            onClick={(e) => {
              onToggleSelect &&
                onToggleSelect(e, path, { ...data, isSelected: !isSelected });
            }}
          >
            {title}
          </span>
        </div>
      </div>
    );
  };

  const rows = [];
  const queue = [{ data: data, indentation: 0, path: path }];
  while (queue.length > 0) {
    const { data, indentation, path } = queue.shift();
    rows.push(renderRow(data, indentation, path));
    const { childrenNode, isExpanded } = data;
    const hasChildren = childrenNode && childrenNode.length > 0;
    // render children node only when parent node had been expanded
    if (hasChildren && isExpanded) {
      for (let i = 0, numIter = childrenNode.length; i < numIter; i++) {
        queue.push({
          data: childrenNode[i],
          indentation: indentation + indentChild,
          path: path.concat(i),
        });
      }
    }
  }
  return rows;
};

TreeNode.propTypes = {
  data: PropTypes.shape({
    icon: PropTypes.node,
    title: PropTypes.string.isRequired,
    childrenNode: PropTypes.array,
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
};

export default TreeNode;
