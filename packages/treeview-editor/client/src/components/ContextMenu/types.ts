export interface ContextMneuPosition {
    x: number
    y: number
}
export type ContextMenuProps = {
    position: ContextMneuPosition
    onClickOutSide: () => void
    items: Record<string, any>
}
