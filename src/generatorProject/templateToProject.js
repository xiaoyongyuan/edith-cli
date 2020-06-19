const metalsmith = require('metalsmith')
const handlebars = require('handlebars')
const rm = require('rimraf').sync
const path = require('path')

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

module.exports = function (metadata = {}, sourcePath) {
  if (!sourcePath) {
    return Promise.reject(new Error('无效的source'))
  }
  let templatePath = path.join(sourcePath, '')
  let targetPath = path.resolve(sourcePath, '../')
  return new Promise((resolve, reject) => {
    metalsmith(process.cwd())
    .metadata(metadata)
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