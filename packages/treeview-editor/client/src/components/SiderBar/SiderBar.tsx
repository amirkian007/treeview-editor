import { NodeList } from '../NodeList/NodeList'
import { useFileSystemChannel } from '../../composables/fileSystemChannelProvider'
import { useEffect } from 'react'
import { useContextMenu } from '../../composables/contextMenuProvider'
import { NodeEditInput } from '../NodeEditInput/NodeEditInput'
import { DirectoryNode } from '@treeview-editor/folder-scaner'
import './SiderBar.scss'
import { Icon } from '../Icon/Icon'
export const SiderBar: React.FC = () => {
  const { startFileSystemServer, treeView } = useFileSystemChannel()

  useEffect(() => {
    startFileSystemServer()
  }, [])
  return <>{treeView && <List treeView={treeView} />}</>
}

const List: React.FC<{ treeView: DirectoryNode }> = ({ treeView }) => {
  const { modificationStatus, handleContextMenu, addFile } = useContextMenu(treeView, () => {})
  const isAdding = modificationStatus === 'adding_file' || modificationStatus === 'adding_directory'

  return (
    <aside className="treeview-asidebar" onContextMenu={handleContextMenu}>
      {isAdding && (
        <div className="treeview-node">
          <div className="icon-container" style={{ rotate: '90deg' }}>
            {modificationStatus == 'adding_directory' && <Icon iconname="arrow"></Icon>}
          </div>
          <NodeEditInput onDone={addFile} node={{ ...treeView, ...{ name: '' } }}></NodeEditInput>
        </div>
      )}

      {treeView && <NodeList nodes={treeView.children} depth={0}></NodeList>}
    </aside>
  )
}
