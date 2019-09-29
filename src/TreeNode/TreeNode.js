import React from 'react'
import PropTypes from 'prop-types'
import './TreeNode.css'
import ArrowDown from '../icon/arrow-down.svg'
import ArrowRight from '../icon/arrow-right.svg'
import Folder from '../icon/folder.svg'
import File from '../icon/file.svg'

function ExpandIcon() {
  return  <img src={ArrowDown} width={15} height={15} />;
};
function CollapseIcon () {
  return <img src={ArrowRight} width={15} height={15} />;
};
function FolderIcon () {
  return <img src={Folder} width={18} height={18} />;
};
function FileIcon () {
  return <img src={File} width={15} height={15} />;
};

const TreeNode = (props) => {
  const { data, onCollapse, onExpand, onToggleSelect, path } = props;
  const { icon, title, childNodes, isExpanded, isSelected } = data;
  const hasChildren = childNodes && childNodes.length > 0;
  const styleOfSelected = isSelected ? { backgroundColor: 'yellow' } : undefined;
  const styleOfFile ={marginLeft: '0px' , marginRight :'5px' };
  const styleOfFolder ={marginLeft: '5px'};
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
      {hasChildren ? (<span style={styleOfFolder}><FolderIcon/> </span>): (<span style={styleOfFile} ><FileIcon/></span>)}
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
   * @param {Array} path - Path to this node
   * @param {Object} node - Data of this node
   */
  onToggleSelect: PropTypes.func,
}

TreeNode.defaultProps = {
  isExpanded: false,
}

export default TreeNode
