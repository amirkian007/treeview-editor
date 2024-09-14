export type ChannelHandlers = {
  onMeesage?: (event: ChanelEvent) => void
  onReady?: Function
  onConnection?: Function
}

export interface ChanelEvent {
  TYPE: string
  payload: any
}
