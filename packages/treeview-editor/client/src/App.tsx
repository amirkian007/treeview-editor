import './App.scss'
import FileSystemChanel from './composables/fileSystemChannelProvider'
import ContextMenuPrivider from './composables/contextMenuProvider'
import { SiderBar } from './components/SiderBar/SiderBar'

function App() {
  return (
    <>
      <FileSystemChanel>
        <ContextMenuPrivider>
          <SiderBar></SiderBar>
        </ContextMenuPrivider>
      </FileSystemChanel>
    </>
  )
}

export default App
