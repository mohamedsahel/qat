const colors: any = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
}

const logTemp = (args, color?) => {
  args.forEach((arg) => {
    if (color) {
      console.log(color, arg)
    } else {
      console.log(args)
    }
  })
}

const log = (...args) => logTemp(args)

log.error = (...args) => logTemp(args, colors.red + '%s\x1b[0m')

log.info = (...args) => logTemp(args, colors.green + '%s\x1b[0m')

log.warn = (...args) => logTemp(args, colors.yellow + '%s\x1b[0m')

export default log
