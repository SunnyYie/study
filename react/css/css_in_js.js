// 1.第一个参数是模板字符串数组
// 2.后面的参数是变量

const div = function (strArr, ...args) {
  // [ '\n  color: red;\n  background: blue;\n  font-size: ', 'px;\n' ] [ 12 ]
  console.log(strArr, args)
  return strArr.reduce((pre, cur, index) => {
    return pre + cur + (args[index] || '')
  }, '')
}

div`
  color: red;
  background: blue;
  font-size: ${12}px;
`
