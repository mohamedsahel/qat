#!/usr/bin/env node

// import getConfig from './utils/config'
import * as toolset from './toolset'
import inquirer from 'inquirer'
import PATH from 'path'

const { fs, log } = toolset

let config

try {
  config = require(PATH.join(process.cwd(), 'qaat.config.js')).default
} catch {
  try {
    config = require(PATH.join(process.cwd(), '.qat/qat.config.js')).default

    fs.setRoot('.qat')
  } catch {
    log('cannot found config file (qat.config.js or .qat/qat.config.js)', 'error')
  }
}


(async () => {
  const { command } = await inquirer.prompt([{
      type: 'input',
      name: 'command',
      message: 'type a command'
    }])

    const [topic, ...args] = command.trim().split(' ')

    if(typeof config[topic] === 'function') {
      config[topic](args, toolset)
    } else {
      log(`cannot find command ${topic}`, 'error')
    }
  }
)()


// const [topic, ...args] = process.argv.splice(2)

// // execute run function
// config[topic](args, toolset)
