import React, { createContext, useContext, useRef, useState } from 'react'
import { ContextMenu } from '../components/ContextMenu/ContextMenu'
import { useFileSystemChannel } from './fileSystemChannelProvider'
import { DirectoryNode } from '@treeview-editor/folder-scaner'

interface ContextMneuPosition {
  x: number
  y: number
}

interface contextData {
  position: ContextMneuPosition
  items: Record<string, any>
}

type ContextMenuType = {
  openContextMenu: (data: contextData) => void
}

export type TreeEditingORAddingStatus = 'editing' | 'adding_file' | 'adding_directory' | 'deleting' | null

type ContextItems = {
  [key: string]: () => void
}

const ContextMenuContext = createContext<ContextMenuType | null>(null)

const ContextMenuPrivider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contexMenuPosition, setContexMenuPosition] = useState<ContextMneuPosition | null>(null)
  const menuItems = useRef<contextData['items']>()

  function openContextMenu(data: contextData) {
    menuItems.current = data.items
    setContexMenuPosition(data.position)
  }

  return (
    <ContextMenuContext.Provider value={{ openContextMenu }}>
      {contexMenuPosition && (
        <ContextMenu
          position={contexMenuPosition}
          onClickOutSide={() => {
            setContexMenuPosition(null)
          }}
          items={menuItems.current!}
        />
      )}
      {children}
    </ContextMenuContext.Provider>
  )
}

export function useContextMenu(node: DirectoryNode, cb: (status: TreeEditingORAddingStatus) => void, isRoot?: boolean) {
  const { openContextMenu } = useContext(ContextMenuContext) as ContextMenuType
  const { dispatchEvent } = useFileSystemChannel()
  const [modificationStatus, setModificationStatus] = useState<TreeEditingORAddingStatus>(null)

  function setAddFileMode() {
    setModificationStatus('adding_file')
    cb('adding_file')
  }
  function setAddFolderMode() {
    setModificationStatus('adding_directory')
    cb('adding_directory')
  }
  function setEditmode() {
    setModificationStatus('editing')
    cb('editing')
  }
  function onDeleteFile() {
    dispatchEvent.deleteFile(node.path)
    cb('deleting')
  }

  let contextItems: ContextItems = {}
  const contextMneuOptions = {
    file: {
      delete_file: onDeleteFile,
      edit_file: setEditmode
    },
    directory: {
      new_file: setAddFileMode,
      new_folder: setAddFolderMode,
      delete_folder: onDeleteFile,
      edit_folder: setEditmode
    },
    rootDirectory: {
      new_file: setAddFileMode,
      new_folder: setAddFolderMode
    }
  }

  if (isRoot) {
    contextItems = { ...contextMneuOptions['rootDirectory'] }
  } else {
    contextItems = { ...contextMneuOptions[node.type] }
  }

  function handleContextMenu(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    openContextMenu({ position: { x: event.pageX, y: event.pageY }, items: contextItems })
  }

  function editFile(name: string) {
    dispatchEvent.rename(node.path, name)
    setModificationStatus(null)
  }

  function addFile(name: string) {
    setModificationStatus(null)
    if (!name) return
    if (modificationStatus === 'adding_file') {
      dispatchEvent.addFile(node.path, name)
    } else {
      dispatchEvent.addFolder(node.path, name)
    }
  }

  return {
    modificationStatus,
    handleContextMenu,
    addFile,
    editFile
  }
}

export default ContextMenuPrivider
