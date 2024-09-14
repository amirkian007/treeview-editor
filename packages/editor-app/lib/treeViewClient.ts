#!/usr/bin/env vite-node --script

import findFreePorts from "find-free-ports";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { WebsocketTransportServer } from "@treeview-editor/web-socket";
import { DirectoryNode, FileSystemController } from "@treeview-editor/folder-scaner";
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const isDev = !!process.env.MODE

type ChanelTypes = 'SET_FILES' | 'DELETE_FILE' | 'EDIT_PATH' | 'ADD_FILE' | 'ADD_FOLDER'

type ChanelPayloads = {
    SET_FILES : DirectoryNode,
    DELETE_FILE :string,
    EDIT_PATH: {path:string,newName:string}
    ADD_FILE:{path:string,name:string}
    ADD_FOLDER:{path:string,name:string}
}

export interface ChanelEventData<T extends ChanelTypes> {
    TYPE : T
    payload : ChanelPayloads[T]
}

export type ChanelEvent = {
  [K in keyof ChanelPayloads]: ChanelEventData<K>;
}[keyof ChanelPayloads];

class TreeViewClient {
 
  private wsServer!: WebsocketTransportServer;
  
  private fileSystemController: FileSystemController;

  constructor(){
    this.fileSystemController = new FileSystemController()
  }

  public async startServer() {
    const [socketServerPort] = await findFreePorts(1);
    
    this.wsServer = new WebsocketTransportServer(socketServerPort);
    this.wsServer.on('onReady',async ()=>{
      await this.startClientApp(socketServerPort)
    })
    this.wsServer.on('onMeesage',async (d:ChanelEvent)=>{
      console.log(d)
      if(d.TYPE === 'DELETE_FILE'){
       await this.fileSystemController.delete(d.payload)
       this.updateClientTreeView()
      }
      if(d.TYPE === 'EDIT_PATH'){
       this.fileSystemController.rename(d.payload.path,d.payload.newName)
       this.updateClientTreeView()
      }
      if(d.TYPE === 'ADD_FILE'){
       this.fileSystemController.write(d.payload.path,d.payload.name,false)
       this.updateClientTreeView()
      }
      if(d.TYPE === 'ADD_FOLDER'){
       this.fileSystemController.write(d.payload.path,d.payload.name,true)
       this.updateClientTreeView()
      }
     
    })
    this.wsServer.on('onConnection',()=>{
      console.log('connection')
      this.updateClientTreeView()
    })
  }

  updateClientTreeView(){
    const dirTree = this.fileSystemController.getDirTree()
    this.sendToClients({'TYPE':'SET_FILES',payload:dirTree})
  }
  private sendToClients(event:ChanelEvent){
    this.wsServer.broadcast(event)
  }
 
  private async startClientApp(socketServerPort:number){
    const clientDir = isDev ? '../client' : './client'
    const server = await createServer({
      plugins: [isDev ? react() : null],
      configFile: false,
      root: path.join(__dirname,clientDir),
      define: {
        __SOCKET_URL__: JSON.stringify(`ws://localhost:${socketServerPort}`),
      },
    });

    await server.listen();
 
    server.printUrls();
  }
}

const treeViewClient = new TreeViewClient();
treeViewClient.startServer();
