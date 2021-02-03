import { execCommand, resolvePath } from '../utils/helpers'


// excute command line commands
const executeCommand = async (commands: string | string[]) => {
  const isArray = Array.isArray(commands)
  const isString = typeof commands === 'string'

  if (!isArray && !isString) return

  let output: any

  if (Array.isArray(commands)) {
    output = await execCommand(commands.join(' && '))
  } else if (isString) {
    output = await execCommand(commands)
  }

  if (output.trim()) {
    console.log(output)
  }
}


// execute shell file
const executeFile = async (path: string) => {
  await executeCommand('sh ' + resolvePath(path))
}

export default {
  command: execCommand,
  file: executeFile
}