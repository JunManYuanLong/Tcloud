function generateUUID () {
  let d = new Date().getTime()
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}

function getSuffix (filename) {
  var pos = filename.lastIndexOf('.')
  var suffix = ''
  if (pos !== -1) {
    suffix = filename.substring(pos)
  }
  return suffix
}

function splitLine (str, symbol) {
  if (!str) {
    return ''
  }
  return str.split(symbol).join('\n')
}

const checkingParam = (list, vm) => {
  for (let i = 0; i < list.length; i++) {
    if (!list[i].name) {
      vm.$message.error('还有未填写的属性名称')
      return false
    }
    if (list[i].platformList.length === 0) {
      vm.$message.error('还有未选择的所属平台')
      return false
    }
    if (!list[i].description) {
      vm.$message.error('还有未填写的属性描述')
      return false
    }
  }
  return true
}
export {generateUUID, getSuffix, splitLine, checkingParam}