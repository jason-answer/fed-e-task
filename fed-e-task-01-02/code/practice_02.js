const fp = require('lodash/fp')

// horsepower:马力  dollar_value:价格 in_stock 库存
const cars = [
  { name: 'Ferrari FF', horsepower: 660, dollar_value: 700000, in_stock: true },
  { name: 'Spyker C12 Zagato', horsepower: 650, dollar_value: 648000, in_stock: false },
  { name: 'Jaguar XKR-S', horsepower: 550, dollar_value: 132000, in_stock: false },
  { name: 'Audi R8', horsepower: 525, dollar_value: 114200, in_stock: false },
  { name: 'Aston Martin One-77', horsepower: 750, dollar_value: 1850000, in_stock: true },
  { name: 'Pagani Huayra', horsepower: 700, dollar_value: 1300000, in_stock: false },
]

//==========================================Code Practice 1 ============================================
// 练习1
// let isLastInStock = function(cars) {
//   // 获取最后一条数据
//   let last_car = fp.last(cars)
//   // 获取最后一条数据的 in_stock 属性值
//   return fp.prop('in_stock', last_car)
// }

// 实现
let isLastInStock = fp.flowRight(fp.prop('in_stock'), fp.last)
console.log(isLastInStock(cars)) // false

// 练习2：使用fp.flowRight()、fp.prop()、fp.first()获取第一个car的name

const carName = car => fp.prop('name', car)
const isFirstName = fp.flowRight(carName, fp.first)
console.log(isFirstName(cars)) // Ferrari FF

// 练习3：使用帮助函数_average重构averageDollarValue，使用函数组合的方式实现

let _average = function(xs) {
  return fp.reduce(fp.add, 0, xs) / xs.length
} // 无须改动

// let averageDollarValue = function(cars) {
//   let dollar_values = fp.map(function(car) {
//     return car.dollar_value
//   }, cars)
//   return _average(dollar_values)
// }

// 重构
let averageDollarValue = fp.flowRight(_average, fp.map(car => car.dollar_value))(cars)
console.log(averageDollarValue) // 790700

// 练习4：使用flowRight写一个sanitizeNames()函数，返回一个下划线连接的小写字符串，把数组中的name转换为这种形式：例如sanitizeNames(['Hello World']) => ['hello_world']

// let _underscore = fp.replace(/\W+/g, '_') // 无须改的，并在sanitizeNames中使用它

// 实现
let _underscore = fp.replace(/\W+/g, '_')
const sanitizeNames = fp.flowRight(_underscore, fp.toLower)
console.log(sanitizeNames('Hello World')) // hello_world


//==========================================Code Practice 2 ============================================



// 练习1：使用fp.add(x, y)和fp.map(f, x)创建一个能让functor里的值增加的函数ex1

const { Maybe, Container } = require('./support')

let maybe = Maybe.of([5, 6, 1])

// 实现
let ex1 = (maybe) => (y) => maybe.map(fp.map(x => fp.add(x, y)))
console.log(ex1(maybe)(1)) // Maybe { _value: [ 6, 7, 2 ] }

// ### 练习2：实现一个函数ex2，能够使用fp.first获取列表的第一个元素

let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
let ex2 = (xs) => xs.map(fp.first)
console.log(ex2(xs)) // Container { _value: 'do' }

// 练习3：实现一个函数ex3，使用safeProp和fp.first找到user的名字的首字母

let safeProp = fp.curry(function(x, o) {
  return Maybe.of(o[x])
})
let user = { id: 2, name: 'Albert' }

// 实现
let ex3 = (key, obj) => safeProp(key, obj).map(fp.first)

console.log(ex3('name', user)) // Maybe { _value: 'A' }

// 练习4：使用Maybe重写ex4，不要有if语句
// let ex4 = function(n) {
//   if (n) { return parseInt(n)}
// }

 let ex4 = (n)=> Maybe.of(n).map(x=> parseInt(x))

 console.log(ex4('5555')) // Maybe { _value: 5555 }
