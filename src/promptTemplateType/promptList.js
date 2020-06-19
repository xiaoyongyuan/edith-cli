const templateList = require('../config')
// 日志格式配置
const log = require('../utils/log')

module.exports = [
  {
    type: 'list',
    name: 'templateType',
    message: `请选择新建项目的模板`,
    choices: templateList.map((item) => ({
      value: item,
      name: `${item.name}\t${log.chalk.green(item.description)}`,
      short: item.name
    })),
  },
]
