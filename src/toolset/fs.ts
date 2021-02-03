import isValidePath from 'is-valid-path'
import chokidar from 'chokidar'
const FS  = require('fs').promises
const PATH = require('path')


import { execCommand, handleError } from '../utils/helpers'
import applyTemplate from './applyTemplate'


/***************
 1 - Create
 2 - Edit
 3 - Read
 4 - Delete
**************/

class Fs {
  root = process.cwd()

  private hasExtension = (path: string) => {
    const base = PATH.basename(path)

    return  /[^\\/]+\.[^\\/]+$/.test(base)
  }

  private stats = async (path: string) => {
    const stats = await FS.stat(path)

    return {
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory()
    }
  }

  setRoot = (path: string) => this.root = PATH.resolve(this.root, path)


  isExists = async (path: string) => {
    try {
      await FS.access(path)
      return true
    } catch (error) {
      return false
    }
  }

  /************
    Create
  ************/
  createFile = async (path: string, content: string = '') => {
    await FS.writeFile(path, content)
      .catch(handleError(`cannot create file [${path}]`))

    return path
  }

  createFolder = async (path: string) => {
    FS.mkdir(path, { recursive: true })
      .catch(handleError(`cannot create folder [${path}]`))

    return path
  }

  create = async (object: any, parentPath: string = process.cwd()) => {
    if(!object) return

    if(typeof object === 'string') {
      if(this.hasExtension(object)) {
        this.createFile(object)
        return
      }

      this.createFolder(object)
      return
    }


    if(Array.isArray(object)) {
      object.forEach(subObject => this.create(subObject, parentPath))
      return
    }


    if(typeof object === 'object') {
      if(!isValidePath(object.path)) {
        handleError(`unvalid path : ${object.path}`)()
      }

      if(object.type === 'folder' || object.hasOwnProperty('children')) {
          const folderPath = await this.createFolder(PATH.join(parentPath, object.path))

          await this.create(object.children, folderPath)

          return
      }

      if(object.type === 'file' || object.hasOwnProperty('content')) {
        this.createFile(PATH.join(parentPath, object.path), object.content)

        return
      }

      if(this.hasExtension(object.path)) {
        this.createFile(PATH.join(parentPath, object.path), object.content)

        return
      }

      this.createFolder(object.path)
    }
  }


  /************
    Read
  ************/
  private read = async (path: string, method: Function, isInsideConfigDir?: boolean | undefined) => {
    if(isInsideConfigDir && typeof isInsideConfigDir === 'boolean') {
      path = PATH.join(this.root, path)
    }

    const isExists = await this.isExists(path)
    if(!isExists) handleError(`unexisted path [${path}]`)()

    const content = await method(path, 'utf8').catch(handleError(`cannot read file [${path}]`))

    return content
  }

  readFile = async (path: string, isInsideConfigDir?: boolean | undefined) => this.read(path, FS.readFile, isInsideConfigDir)
  readDir = async (path: string, isInsideConfigDir?: boolean | undefined) => this.read(path, FS.readdir, isInsideConfigDir)
  readTemplate = async (path: string, variables?: any, marks?: string[]) => {
    const content = await this.read(path, FS.readFile, true)
    if(!variables) {
      return content
    }
    return applyTemplate(content, variables, marks)
  }



  /************
    Edit
  ************/
 edit = async (path: string, editConent: any) => {
   const isExists = await this.isExists(path)
   if(!isExists) return

   try {
     const oldConent = await this.readFile(path)
     const newConent = await editConent(oldConent)

     await this.create({
       path,
       type: 'file',
       content: newConent
      })

      return newConent
    } catch (err) {
      handleError(`cannot edit file [${path}]`)
    }
  }



  /************
    Delete
  ************/
 private deletePath = async (path: string) => {
   const isExists = await this.isExists(path)
   if(!isExists) return

   const stats = await this.stats(path)

   if(stats.isFile) {
     await FS.unlink(path).catch(handleError(`cannot delete file [${path}]`))
    }
    else if(stats.isDirectory) {
      await FS.rmdir(path, { recursive: true }).catch(handleError(`cannot delete folder [${path}]`))
    }
  }

  delete = async (paths: any) => {
    if(typeof paths === 'string') {
      await this.deletePath(paths)

      return
    }

    if(Array.isArray(paths)) {
      await Promise.all(paths.map(async path => await this.deletePath(path)))

      return
    }
  }



  /************
    Open
  ************/
  open = async (paths: string | string[]) => {
    try {
      if (typeof paths === 'string') await execCommand(`code -r ${paths}`)
      else if (Array.isArray(paths)) await execCommand(`code -r ${paths.join(' ')}`)
    } catch (err) {
      handleError(`cannot open files [${paths}]`)(err)
    }
  }



  /************
    Watch (add - change - unlink)
  ************/
 watch = (path, options?) => chokidar.watch(path, {
  persistent: true,
  ignoreInitial: true,
  ...options
 })


  /************
    Copy files
  ************/
  copy = async (srcDir, destDir, files?) => {
    const isDestExist = await this.isExists(destDir)

    if(!isDestExist) {
      await this.create({
        path: destDir,
        type: 'folder',
      })
    }

    if(!files) {
      files = await this.readDir(srcDir)
    }

    return Promise.all(files.map(f => {
      return FS.copyFile(PATH.join(srcDir, f), PATH.join(destDir, f))
    }))
  }
}



export default new Fs()