import PATH from 'path'

const getConfig = () => require(PATH.join(process.cwd(), 'qat.config.js')).default

export default getConfig