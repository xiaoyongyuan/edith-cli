const execa = require('execa')
const semver = require('semver')
const ora = require('ora')

// 日志格式配置
const log = require('../utils/log')
const { name, version } = require('../../package.json')

module.exports = async function () {
  const spinner = ora('版本检测中...')
  try {
    spinner.start()
    const { stdout } = await execa.command(`npm view ${name} version`)
    spinner.stop()
    if (semver.gt(stdout, version)) {
      log.warring(
        `当前版本v${version}, 最新版本v${stdout}`
      )
    } else {
      log.info(`当前版本v${version}`)
    }
  } catch (error) {
    spinner.stop()
    log.error(error)
  }
}
