import React, { Component } from 'react'
import TreeNode from './TreeNode'

import styles from './styles.css'

export default class ExampleComponent extends Component {
  render() {
    return (
      <div>
        <TreeNode
          title={'title'}
          icon={<span>(i)</span>}
          childNodes={[{title: '_title'}]}
          onExpand={() => console.log('expand')}
          onCollapse={() => console.log('collapse')}
          isExpanded={true}
          onSelect={() => console.log('select')}
        />
      </div>
    );
  }
}
