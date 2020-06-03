# 陈刚 | Part 1 | 模块一
## 一、简答题
### 1、描述引用计数的工作原理和优缺点
* 原理：为变量对象设置一个引用数值，引用一次引用数值加一，引用减少一次引用数值减一；当引用数值为0时GC就回收内存
* 优点：
    * 发现垃圾立即回收
    * 最大限度减少查询暂停（时刻监控变量保证内存不被占满）
* 缺点：
    * 无法回收循环引用的对象
    * 时间开销大（监控对象引用数值是否要修改，修改数值需要时间）



### 2、描述标记整理算法的工作流程
* 分为标记阶段和整理阶段
* 标记阶段:遍历所有对象找标记活动对象，遍历所有对象清除没有标记的对象（会把第一次标记抹除，便于下次GC工作）
* 整理阶段：移动对象位置，使活动对象和非活动对象、碎片空间地址连续，后续能够最大化使用内存空间，减少碎片空间
  * 优点：

      * 弥补了标记-清除算法，内存区域分散的缺点
      * 弥补了复制算法内存减半的代价
  * 缺点:

      * 效率不高，对于标记-清除而言多了整理工作，对于复制算法而言多了标记工作



### 3、描述V8中新生代存储区垃圾回收的流程
  1. From空间中所有能从根对象到达的对象复制到To区。
  2. 维护两个To区的指针scanPtr和allocationPtr，分别指向即将扫描的活跃对象和即将为新对象分配内存的地方，开始循环.
  3. 循环的每一轮会查找当前scanPtr所指向的对象, 
  4. 如果指向From区，需要把这个所指向的对象从From区复制到To区，具体复制的位置就是allocationPtr所指向的位置。
  5. 所指对象内的指针修改为新复制对象存放的地址，并移动allocationPtr。
  6. scanPtr和allocationPtr相遇，则说明所有的对象都已被复制完，From区剩下的都可以被视为垃圾，可以清理内存。



### 4、描述增量标记算法在何时使用，及工作原理
增量标记算法优化垃圾回收操作
工作原理：程序执行完后，对老生代存储区域遍历对象进行标记，变量存在直接可达和间接可达操作，当找到第一层可达是就可以停下让程序继续执行，然后在进行二次标记，然后执行程序，交替执行；标记完成后执行垃圾回收



## 二、代码题
### 基于一下代码完成下面的四个练习
```javascript
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
```



### 练习1：使用函数组合fp.flowRight()重新实现下面这个函数
```javascript
let isLastInStock = function(cars) {
  // 获取最后一条数据
  let last_car = fp.last(cars)
  // 获取最后一条数据的 in_stock 属性值
  return fp.prop('in_stock', last_car)
}

// 实现
let isLastInStock = fp.flowRight(fp.prop('in_stock'), fp.last)
console.log(isLastInStock(cars)) // false
```



### 练习2：使用fp.flowRight()、fp.prop()、fp.first()获取第一个car的name
```javascript
const carName = car => fp.prop('name', car)
const isFirstName = fp.flowRight(carName, fp.first)
console.log(isFirstName(cars)) // Ferrari FF
```



### 练习3：使用帮助函数_average重构averageDollarValue，使用函数组合的方式实现
```javascript
let _average = function(xs) {
  return fp.reduce(fp.add, 0, xs) / xs.length
} // 无须改动

let averageDollarValue = function(cars) {
  let dollar_values = fp.map(function(car) {
    return car.dollar_value
  }, cars)
  return _average(dollar_values)
}

// 重构
let averageDollarValue = fp.flowRight(_average, fp.map(car => car.dollar_value))(cars)
console.log(averageDollarValue) // 790700
```



### 练习4：使用flowRight写一个sanitizeNames()函数，返回一个下划线连接的小写字符串，把数组中的name转换为这种形式：例如sanitizeNames(['Hello World']) => ['hello_world']
```javascript
let _underscore = fp.replace(/\W+/g, '_') // 无须改的，并在sanitizeNames中使用它

// 实现
let _underscore = fp.replace(/\W+/g, '_')
const sanitizeNames = fp.flowRight(_underscore, fp.toLower)
console.log(sanitizeNames('Hello World')) // hello_world
```



### 基于下面提供的代码，完成后续的四个练习
```javascript
// support.js

class Container {
  static of(value) {
    return new Container(value)
  }

  constructor(value) {
    this._value = value
  }

  map(fn) {
    return Container.of(fn(this._value))
  }
}

class Maybe {
  static of(x) {
    return new Maybe(x)
  }

  isNothing() {
    return this._value === null || this._value === undefined
  }

  constructor(x) {
    this._value = x
  }

  map(fn) {
    return this.isNothing() ? this : Maybe.of(fn(this._value))
  }
}

module.exports = {
  Maybe,
  Container
}
```



### 练习1：使用fp.add(x, y)和fp.map(f, x)创建一个能让functor里的值增加的函数ex1
```javascript
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')

let maybe = Maybe.of([5, 6, 1])

// 实现
let ex1 = (maybe) => (y) => maybe.map(fp.map(x => fp.add(x, y)))
console.log(ex1(maybe)(1)) // Maybe { _value: [ 6, 7, 2 ] }
```



### 练习2：实现一个函数ex2，能够使用fp.first获取列表的第一个元素
```javascript
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')

let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])

// 实现
let ex2 = (xs) => xs.map(fp.first)
console.log(ex2(xs)) // Container { _value: 'do' }
```



### 练习3：实现一个函数ex3，使用safeProp和fp.first找到user的名字的首字母
```javascript
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')

let safeProp = fp.curry(function(x, o) {
  return Maybe.of(o[x])
})
let user = { id: 2, name: 'Albert' }

// 实现
let ex3 = (key, obj) => safeProp(key, obj).map(fp.first)

console.log(ex3('name', user)) // Maybe { _value: 'A' }
```



### 练习4：使用Maybe重写ex4，不要有if语句
```javascript
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')

let ex4 = function(n) {
  if (n) { return parseInt(n)}
}

// 实现
 let ex4 = (n)=> Maybe.of(n).map(x=> parseInt(x))

 console.log(ex4('5555')) // Maybe { _value: 5555 }
```