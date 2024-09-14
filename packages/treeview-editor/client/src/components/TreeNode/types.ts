import { DirectoryNode } from "@treeview-editor/folder-scaner"
import { ButtonHTMLAttributes } from 'react'
export type TreeNodeProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    node: DirectoryNode
    depth?: number
  }
  
export type TreeNodeStatus = 'open' | 'closed'