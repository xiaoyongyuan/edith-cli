const fs = require('fs-extra')
const path = require('path')
const rm = require('rimraf').sync
const metalsmith = require('metalsmith')
const handlebars = require('handlebars')

const metaToPromptList = require('./metaToPromptList')
const getPromptAnswers = require('../utils/getPromptAnswers')
const templateToProject = require('./templateToProject')
const metaToCompleteMsg = require('./metaToCompleteMsg')
const log = require('../utils/log')

const blackList = [
  'public',
  'src'
]

function findFileInBlackList (fileName) {
  let flag = false
  for (let item of blackList) {
    if (fileName.indexOf(item) === 0) {
      flag = true
      break
    }
  }
  return flag
}


module.exports = async function (projectName, type) {
  try {
    let sourcePath = path.join(process.cwd(), projectName, 'source')
    if (!type) {
      let metaPath = path.join(sourcePath, 'meta.json')
      let data = fs.readFileSync(metaPath, 'utf-8')
      let metaJson = JSON.parse(data)
      let promptList = metaToPromptList(metaJson.prompts)
      let answers = await getPromptAnswers(promptList)
      await templateToProject(answers, sourcePath)
      let completeMessage = metaToCompleteMsg(metaJson.completeMessage, projectName)
      log.info(completeMessage)
    } else {
      let templatePath = path.join(sourcePath, '/src/views/ListTemplate')
      let targetPath = path.resolve(sourcePath, '../')
      return new Promise((resolve, reject) => {
        metalsmith(process.cwd())
          .clean(false)
          .source(templatePath)
          .destination(targetPath)
          .use((files, metalsmith, done) => {
            for (let fileName in files) {
              // husky文件处理
              if (fileName.indexOf('.huskyrc') !== -1) {
                const huskyJson = {
                  "hooks": {
                    "pre-commit": "npm run lint",
                    "commit-msg": "validate-commit-msg"
                  }
                }
                files[fileName].contents = JSON.stringify(huskyJson)
                continue
              }
              if (!findFileInBlackList(fileName)) {
                const fileContentsString = files[fileName].contents.toString() // buffer转字符串，handlebars需要
                files[fileName].contents = Buffer.from(handlebars.compile(fileContentsString)(metalsmith.metadata()))
              }
            }
            done()
          }).build(err => { // build
            rm(sourcePath)
            if (err) {
              return reject(new Error(`项目构建失败: ${err}`))
            } else {
              return resolve()
            }
          })
      })
    }
  } catch (error) {
    rm(path.join(process.cwd(), projectName))
    log.error(error)
  }

}