import MuCli from './cli/index.js'

const cmd = process.argv

console.log(cmd)

MuCli.parse(cmd)
