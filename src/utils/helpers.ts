import PATH from 'path'
import { exec } from 'child_process'

import { log } from '../toolset'


export const resolvePath = (...paths: string[]) => PATH.resolve(process.cwd(), ...paths)

export const setCwd = (path: string) => {
  process.chdir(path)
}


// helper fonction for excuting command line commands
export const execCommand = (cmd: string) => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      }
      resolve(stdout ? stdout : stderr)
    })
  })
}

// error handler
export const handleError = (topic: string) => {
  return (error?: string) => {
    log(`Error: ${topic} \n`, 'error')
    process.exit()
  }
}
