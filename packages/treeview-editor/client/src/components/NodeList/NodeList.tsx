import { ButtonHTMLAttributes } from 'react'
// import { ChanelEvent, ChanelEventData } from '../../lib/treeViewClient'
import { DirectoryNode } from '@treeview-editor/folder-scaner'
import { TreeNode } from '../TreeNode/TreeNode'
import './NodeList.scss'
type NodeListProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  nodes: DirectoryNode[]
  depth?: number
}

export const NodeList: React.FC<NodeListProps> = ({ nodes, depth = 0 }) => {
  return (
    <div className="node-childrenWrapper" style={{ height: 'auto' }}>
      {nodes.map((node, i) => {
        return <TreeNode depth={depth + 1} node={node} key={i} />
      })}
    </div>
  )
}
