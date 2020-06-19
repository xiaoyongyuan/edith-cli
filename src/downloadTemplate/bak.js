const execa = require('execa')

module.exports = async function (gitUrl, branch, projectName) {
  if (!gitUrl) {
    throw new Error('gitUrl is null')
  }
  try {
    await execa('git', ['clone', gitUrl, '-b', branch, `${projectName}/source`])
  } catch (error) {
    throw new Error(error.shortMessage || error)
  }
}
