// import {pinyin} from 'pinyin'
import 'pinyin4js'
let str2pinyin = (str) => {
  if (typeof str === 'string' && /.*[\u4e00-\u9fa5]+.*$/.test(str)) {
    let result = []
    // let data = ''
    // let r = pinyinlite(str, {keepUnrecognized: true})
    // let r = pinyin(str, {heteronym: false, segment: false, style: 0})
    let data = PinyinHelper.convertToPinyinString(str, '', PinyinFormat.WITHOUT_TONE)
    // for (let i = 0; i < r.length; i++) {
    //   for (let j =0; j < r[i].length; j++) {
    //     data += r[i][j]
    //   }
    // }
    // let data = ''
    // r.forEach(item => {
    //   data += item[0]
    // })
    // console.log(str, r, data)
    return data
  } else {
    return str
  }
}

export {str2pinyin}