module.exports = function(metaJson) {
  let promptList = []
  for (let key in metaJson) {
    promptList.push({
      type: metaJson[key].type,
      name: key,
      message: metaJson[key].label,
      default: metaJson[key].default
    })
  }
  return promptList
}