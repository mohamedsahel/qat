#!/usr/bin/env node

import * as toolset from './toolset'
import PATH from 'path'

const { log } = toolset

let config

try {
  config = require(PATH.join(process.cwd(), 'qat.config.js'))
} catch {
  try {
    config = require(PATH.join(process.cwd(), '.qat/qat.config.js'))
  } catch {
    log.error('cannot found config file (qat.config.js or .qat/qat.config.js)')
  }
}

const [topic, ...args] = process.argv.splice(2)

// execute run function
if (config && typeof config[topic] === 'function') {
  config[topic]({ args, ...toolset })
} else {
  log.error(`cannot find command ${topic}`)
}
