import { useState } from 'react'
import { ButtonHTMLAttributes } from 'react'
import { DirectoryNode } from '@treeview-editor/folder-scaner'
import { NodeList } from '../NodeList/NodeList'
import { NodeEditInput } from '../NodeEditInput/NodeEditInput'
import { Icon } from '../Icon/Icon'
import { TreeEditingORAddingStatus, useContextMenu } from '../../composables/contextMenuProvider'
import './TreeNode.scss'

type TreeNodeProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  node: DirectoryNode
  depth?: number
}

type TreeNodeStatus = 'open' | 'closed'

export const TreeNode: React.FC<TreeNodeProps> = ({ node, depth = 1 }) => {
  const [childrenStatus, setChildrenStatus] = useState<TreeNodeStatus>('closed')

  const { modificationStatus, handleContextMenu, addFile, editFile } = useContextMenu(node, onModificationCb)

  const isAdding = modificationStatus === 'adding_file' || modificationStatus === 'adding_directory'
  const isChildrenOpen = node.children && childrenStatus != 'closed'
  const isEditing = modificationStatus === 'editing'

  function toggleOpen() {
    if (isEditing) return
    setChildrenStatus(isChildrenOpen ? 'closed' : 'open')
  }

  function onModificationCb(status: TreeEditingORAddingStatus) {
    if (status === 'adding_directory' || status === 'adding_file') {
      setChildrenStatus('open')
    }
  }

  return (
    <>
      {/* main btn */}
      <button
        className="treeview-node"
        style={{ paddingLeft: depth * 8 }}
        onClick={toggleOpen}
        onContextMenu={handleContextMenu}
      >
        <div className="icon-container" style={{ rotate: isChildrenOpen ? '180deg' : '90deg' }}>
          {node.children && <Icon iconname="arrow"></Icon>}
        </div>
        {isEditing ? <NodeEditInput onDone={editFile} node={node}></NodeEditInput> : node.name}
      </button>
      {/* add file or folder input */}
      {isAdding && (
        <button className="treeview-node" style={{ paddingLeft: (depth + 1) * 8 }}>
          <div className="icon-container" style={{ rotate: '90deg' }}>
            {modificationStatus === 'adding_directory' && <Icon iconname="arrow"></Icon>}
          </div>
          <NodeEditInput onDone={addFile} node={{ ...node, ...{ name: '' } }}></NodeEditInput>
        </button>
      )}
      {/* children */}
      {isChildrenOpen && <NodeList nodes={node.children} depth={depth} />}
    </>
  )
}
