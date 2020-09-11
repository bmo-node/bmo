import execa from 'execa'
import fs from 'fs-extra'

const yarn = 'yarn'
const npm = 'npm'
const install = 'install'
const add = 'add'
const run = 'run'
const packageManagers = [ npm, yarn ]
const isYarn = fs.existsSync('yarn.lock')
const runCommand = (cmd, args) => execa(cmd, args, { stdio: 'inherit' })

const installCmds = {
  [yarn]: () => runCommand(yarn, [ install ]),
  [npm]: () => runCommand(npm, [ install ])
}

const addCommands = {
  [yarn]: pkg => runCommand(yarn, [ add, pkg ]),
  [npm]: pkg => runCommand(npm, [ install, pkg ])
}

const runCommands = {
  [yarn]: script => runCommand(yarn, [ script ]),
  [npm]: script => runCommand(npm, [ run, script ])
}

let pkgManager = isYarn ? yarn : npm

export default () => ({
  get packageManagers() {
    return packageManagers
  },
  install: () => installCmds[pkgManager](),
  add: pkg => addCommands[pkgManager](pkg),
  run: script => runCommands[pkgManager](script),
  use: manager => {
    if (!packageManagers.includes(manager)) {
      throw new Error(`Unknown package manager ${manager}`)
    }

    pkgManager = manager
  }
})
