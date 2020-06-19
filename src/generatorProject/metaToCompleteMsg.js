const handlebars = require('handlebars')

module.exports = function (completeMessage, destDirName) {
  handlebars.registerHelper('inPlace', function (options) {
    return options.fn(this)
  })
  return handlebars.compile(`开始项目:${completeMessage}`)({ destDirName })
}
