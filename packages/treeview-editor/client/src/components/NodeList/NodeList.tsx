import { TreeNode } from '../TreeNode/TreeNode'
import './NodeList.scss'
import { NodeListProps } from './types'
 
export const NodeList: React.FC<NodeListProps> = ({ nodes, depth = 0 }) => {
  return (
    <div className="node-childrenWrapper" style={{ height: 'auto' }}>
      {nodes.map((node, i) => {
        return <TreeNode depth={depth + 1} node={node} key={i} />
      })}
    </div>
  )
}
