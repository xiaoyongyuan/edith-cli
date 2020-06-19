'use strict'

const chalk = require('chalk')
const {name} = require('../../package.json')

let log = {}
log.prefix = ''
log.chalk = chalk

// 日志类型
const logType = [
  { name: 'info', color: chalk.green },
  { name: 'error', color: chalk.red },
  { name: 'warring', color: chalk.yellow },
]

// 添加类型方法
logType.forEach((item) => {
  log[item.name] = (msg) => {
    console.log(`${(log.prefix || name)} ${item.color(item.name.toUpperCase())} ${msg}`)
  }
})

module.exports = log
