import { DirectoryNode } from '@treeview-editor/folder-scaner'
import { WebsocketTransport } from '@treeview-editor/web-socket'
import React, { createContext, useContext, useRef, useState } from 'react'
import { ChanelEvent } from '../../../lib/treeViewServer'

interface ServerActions {
  deleteFile: (path: string) => void
  addFile: (path: string, name: string) => void
  addFolder: (path: string, name: string) => void
  rename: (path: string, newName: string) => void
}

type FileSystemChanelType = {
  treeView: DirectoryNode | null
  startFileSystemServer: () => void
  dispatchEvent: ServerActions
}

const ChannelContext = createContext<FileSystemChanelType | null>(null)

const FileSystemChanel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [treeViewRootNode, setTreeViewRootNode] = useState<DirectoryNode | null>(null)
  const webSocket = useRef<WebsocketTransport>()

  function startFileSystemServer() {
    webSocket.current = new WebsocketTransport(__SOCKET_URL__)
    webSocket.current.on('onMeesage', (data: ChanelEvent) => {
      if (data.TYPE == 'SET_FILES') {
        setTreeViewRootNode(data.payload)
      }
    })
  }

  function dispatchEvent(event: ChanelEvent) {
    webSocket.current?.send(event)
  }
  function deleteFile(path: string) {
    dispatchEvent({ TYPE: 'DELETE_FILE', payload: path })
  }
  function rename(path: string, newName: string) {
    dispatchEvent({ TYPE: 'EDIT_PATH', payload: { path, newName } })
  }
  function addFile(path: string, name: string) {
    dispatchEvent({ TYPE: 'ADD_FILE', payload: { path, name } })
  }
  function addFolder(path: string, name: string) {
    dispatchEvent({ TYPE: 'ADD_FOLDER', payload: { path, name } })
  }

  const actions = {
    deleteFile,
    rename,
    addFile,
    addFolder
  }

  return (
    <ChannelContext.Provider value={{ treeView: treeViewRootNode, startFileSystemServer, dispatchEvent: actions }}>
      {children}
    </ChannelContext.Provider>
  )
}

export function useFileSystemChannel() {
  return useContext(ChannelContext) as FileSystemChanelType
}

export default FileSystemChanel
