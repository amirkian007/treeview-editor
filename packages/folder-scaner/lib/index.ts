import path from 'path'
import fs from 'fs'
import dirTree from 'directory-tree'
import process from 'process'

export interface DirectoryNode {
  children: DirectoryNode[]
  name: string
  path: string
  type: 'file' | 'directory'
  isRoot?: boolean
}

export class FileSystemController {
  public directoryPath: string
  static options = { exclude: /node_modules/, attributes: ['type'] }
  constructor(rootDir = process.cwd()) {
    this.directoryPath = rootDir
  }

  public getDirTree(): DirectoryNode {
    const dirTre =  dirTree(this.directoryPath, FileSystemController.options as any) as unknown as DirectoryNode
    dirTre.isRoot = true
    return dirTre
  }

  public async delete(filePath: string) {
    const fullPath = path.resolve(filePath)
    const stats = fs.lstatSync(fullPath)
    if (stats.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true })
    } else {
      fs.unlinkSync(fullPath)
    }
    console.log(`Deleted: ${filePath}`)
  }

  public rename(oldPath: string, newName: string) {
    const newPath = path.join(oldPath, '../', newName)

    fs.renameSync(oldPath, newPath)
    console.log(`Renamed from ${oldPath} to ${newPath}`)
  }

  public write(filePath: string, name: string, isFolder: boolean = false) {
    const fullPath = path.join(filePath, name)
    if (isFolder) {
      fs.mkdirSync(fullPath, { recursive: true })
      console.log(`Created folder: ${filePath}`)
    } else {
      fs.writeFileSync(fullPath, '')
      console.log(`Created file: ${filePath}`)
    }
  }
}
