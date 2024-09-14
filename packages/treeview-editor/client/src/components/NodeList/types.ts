import { ButtonHTMLAttributes } from 'react'
// import { ChanelEvent, ChanelEventData } from '../../lib/treeViewClient'
import { DirectoryNode } from '@treeview-editor/folder-scaner'

export type NodeListProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    nodes: DirectoryNode[]
    depth?: number
  }
  