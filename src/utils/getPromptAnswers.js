const inquirer = require('inquirer')

module.exports = function (promptList) {
  return new Promise((resolve, reject) => {
    inquirer
    .prompt(promptList)
    .then((answers) => {
      resolve(answers)
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else when wrong
      }
    })
  }).catch(err => {})
}