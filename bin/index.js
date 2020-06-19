#! /usr/bin/env node
const program = require('commander')
const ora = require('ora')
const path = require('path')
const rm = require('rimraf').sync
const { version } = require('../package.json')

// 日志格式配置
const log = require('../src/utils/log')

// 检测cli的版本信息
const checkCliVersion = require('../src/utils/checkCliVersion')

// 文件方法
const fs = require('../src/utils/fs')

// 询问模版类型
const promptTemplateType = require('../src/promptTemplateType')

// 获取远程项目
const downloadTemplate = require('../src/downloadTemplate')

// 通过模版生成项目
const generatorProject = require('../src/generatorProject')


program
  .version(version)
  .command('create [arg...]')
  .description('创建一个新的admin项目。')
  .action(async arg => {
    const projectName = arg[0];
    if (!projectName) {
      log.error('请输入项目名称！');
      program.help();
      return;
    }
    const type = arg[1];
    if (type && type === 'list') {
      log.info('欢迎使用 edith-cli');
      createListFolder(projectName, type)
    } else {
      log.info('欢迎使用 edith-cli')
      await checkCliVersion()
      createProject(projectName)
    }
  })

program.parse(process.argv)

// 创建列表文件
async function createListFolder(fileName, type) {
  if (!inspectCurrentDir(fileName)) {
    return;
  }

  log.info('开始创建目录')
  // 确定用户选择的模版类型
  let { templateType } = await promptTemplateType(type)

  // 下载远程模板
  let spinner = ora('正在拉取远端数据，请稍后...')
  let sourcePath = `${fileName}/source`
  spinner.start()
  try {
    await downloadTemplate(
      `${templateType.git}${
      templateType.branch ? '#' + templateType.branch : ''
      }`,
      sourcePath
    )
  } catch (error) {
    rm(projectPath)
    spinner.stop()
    return
  }
  spinner.stop()

  // 读取远程模版的询问信息，及handlebars配置信息, 生成项目文件
  await generatorProject(fileName, type)
}

// 创建项目
async function createProject(projectName) {
  if (!inspectCurrentDir(projectName)) {
    return;
  }

  log.info('开始创建项目')
  // 确定用户选择的模版类型
  let { templateType } = await promptTemplateType()
  // 下载远程模板
  let spinner = ora('正在拉取远端数据，请稍后...')
  let sourcePath = `${projectName}/source`
  spinner.start()
  try {
    await downloadTemplate(
      `${templateType.git}${
      templateType.branch ? '#' + templateType.branch : ''
      }`,
      sourcePath
    )
  } catch (error) {
    rm(projectPath)
    spinner.stop()
    return
  }
  spinner.stop()
  // 读取远程模版的询问信息，及handlebars配置信息, 生成项目文件
  await generatorProject(projectName)
}

// 检查当前目录是否可读写
function inspectCurrentDir(projectName) {
  const rootPath = process.cwd()

  // 判断当前目录是否可读写
  let canEdit = fs.fsReadWriteSync(rootPath)
  if (!canEdit) {
    log.error('没有权限编辑当前目录')
    return false;
  }

  // 检测是否已存在该项目文件夹
  const projectPath = path.join(rootPath, projectName)
  const isExists = fs.fsExistsSync(projectPath)
  if (isExists) {
    log.error(`${projectName}已存在`)
    return false;
  }

  return true;
}
