import { WebSocketServer, WebSocket } from 'ws'
import { isJSON, parse, stringify } from 'telejson'
import type { ChannelHandlers, ChanelEvent } from './types'

export class WebsocketTransportServer {
  private clients: Set<WebSocket> = new Set()

  private handlers: ChannelHandlers = {}

  wss: WebSocketServer

  isReady = false

  constructor(port: number) {
    this.wss = new WebSocketServer({ port })
    this.wss.on('listening', () => {
      this.isReady = true
      console.log(`WebSocket server running on port ${port}`)
      if (this.handlers['onReady']) {
        this.handlers['onReady']()
      }
    })
    this.wss.on('connection', (ws: WebSocket) => {
      this.clients.add(ws)
      if (this.handlers['onConnection']) {
        this.handlers['onConnection']()
      }
      ws.on('message', (data: string | ChanelEvent) => {
        const event = typeof data === 'string' && isJSON(data) ? parse(data) : (parse(data.toString()) as ChanelEvent)
        if (this.handlers['onMeesage']) {
          this.handlers['onMeesage'](event)
        }
      })

      ws.on('close', () => {
        this.clients.delete(ws)
        console.log('Client disconnected')
      })

      ws.on('error', (error: any) => {
        console.error(error)
        this.isReady = false
        // throw new Error(error)
      })
    })
  }

  on(eventName: keyof ChannelHandlers, handler: (payload: any) => void) {
    this.handlers[eventName] = handler
  }

  send(ws: WebSocket, event: ChanelEvent) {
    const data = stringify(event, {
      maxDepth: 15,
      allowFunction: false
    })
    ws.send(data)
  }

  broadcast(event: ChanelEvent) {
    const data = stringify(event, {
      maxDepth: 15,
      allowFunction: false
    })
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  }
}
