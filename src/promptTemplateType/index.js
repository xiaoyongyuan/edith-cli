const promptList = require('./promptList')
const getPromptAnswers = require('../utils/getPromptAnswers')
const getFileList = require('./fileList')

module.exports = function (type) {
  if (type) {
    return getPromptAnswers(getFileList)
  } else {
    return getPromptAnswers(promptList)
  }
} 
