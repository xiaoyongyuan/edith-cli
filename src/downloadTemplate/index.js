const download = require('download-git-repo')

module.exports = function (gitUrl, sourcePath) {
  return new Promise((resolve, reject) => {
    if (!gitUrl) {
      reject()
      return
    }
    download(`direct:${gitUrl}`, sourcePath, { clone: true }, function (err) {
      if (err) {
        return
      }
      resolve(true)
    })
  })
}
