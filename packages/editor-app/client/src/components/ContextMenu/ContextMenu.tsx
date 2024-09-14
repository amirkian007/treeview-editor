import './ContextMenu.scss'

interface ContextMneuPosition {
  x: number
  y: number
}
type ContextMenuProps = {
  position: ContextMneuPosition
  onClickOutSide: () => void
  items: Record<string, any>
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ position, onClickOutSide, items }) => {
  function itemCLick(key: string) {
    items[key]()
    onClickOutSide()
  }
  const itemsKeys = Object.keys(items)

  return (
    <>
      <div className="context-bg" onMouseDown={onClickOutSide}></div>
      <ul className="context-menu" style={{ top: position.y, left: position.x }}>
        {itemsKeys.map((key) => {
          return (
            <li key={key}>
              <button
                onClick={() => {
                  itemCLick(key)
                }}
              >
                {key.replace('_', ' ')}
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}
