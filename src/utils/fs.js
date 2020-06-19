const fs = require('fs-extra')

// 检查是否存在
function fsExistsSync(path) {
  return fs.pathExistsSync(path)
}

// 检测是否可读写
function fsReadWriteSync(path) {
  try {
    fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK)
  } catch (err) {
    return false
  }
  return true
}

module.exports = {
  fsExistsSync,
  fsReadWriteSync,
}
