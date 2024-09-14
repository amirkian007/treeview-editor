import { DirectoryNode } from '@treeview-editor/folder-scaner'
import { useEffect, useRef, useState } from 'react'

interface ButtonProps {
  node: DirectoryNode
  onDone: (name: string) => void
}

export const NodeEditInput: React.FC<ButtonProps> = ({ node, onDone }) => {
  const [inputValue, setInputValue] = useState(node.name)
  const ref = useRef<HTMLInputElement>(null)

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value)
  }

  function handleInputBlur() {
    onDone(inputValue)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      onDone(inputValue)
    }
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.focus()
    }
  }, [])

  return (
    <input
      ref={ref}
      onChange={handleInputChange}
      onBlur={handleInputBlur}
      value={inputValue}
      onKeyDown={handleKeyDown}
    />
  )
}
