import { isJSON, parse, stringify } from 'telejson'
import type { ChanelEvent, ChannelHandlers } from './types'

// Ref : https://github.com/storybookjs/storybook/blob/next/code/core/src/channels/websocket/index.ts

export class WebsocketTransport {
  private handlers: ChannelHandlers = {}

  private socket: WebSocket

  isReady = false

  constructor(url: string | URL) {
    this.socket = new WebSocket(url)
    this.socket.onopen = () => {
      this.isReady = true
      console.log('websocket is ready')
    }
    this.socket.onmessage = ({ data }) => {
      const event = typeof data === 'string' && isJSON(data) ? parse(data) : data
      console.log(event)
      if (this.handlers['onMeesage']) {
        this.handlers['onMeesage'](event)
      }
    }
    this.socket.onerror = (e) => {
      console.error(e)
      //   throw new Error(e)
    }
    this.socket.onclose = () => {
      console.log('DISCONNECTED from socket server')
    }
  }

  on(eventName: keyof ChannelHandlers, handler: (payload: any) => void) {
    this.handlers[eventName] = handler
  }

  send(event: ChanelEvent) {
    const data = stringify(event, {
      maxDepth: 15,
      allowFunction: false
    })
    this.socket.send(data)
  }

}
