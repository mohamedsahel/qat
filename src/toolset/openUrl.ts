import { execCommand } from '../utils/helpers'
import { log } from '.'

export type OpenUrlType = (url: string) => void

// open the given url in th edefault browser
const openURL: OpenUrlType = async (url) => {
  log.info(`opening url (${url}) ...`)

  const start: string = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open'
  await execCommand(start + ' ' + url)
}

export default openURL