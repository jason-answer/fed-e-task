# 陈刚 | Part 1 | 模块一



## 一、简答题

### 1. 请说出下列最终的执行结果，并解释为什么？

```js
var a = []

for (var i = 0; i < 100; i++) {
  a[i] = function () {
    console.log(i)
  }
}

a[6]()
```

**执行结果** `100`

**原因**

+ 全局生命变量 i 执行循环后变成100,当调用任何a[xxxx](),都为100
+ 综上所述，执行结果为 `100` 。

>  [ES6 标准入门 -- let](https://es6.ruanyifeng.com/?search=tdz&x=0&y=0#docs/let)

---

### 2. 请说出下列最终的执行结果，并解释为什么？

```js
var temp = 123

if (true) {
  console.log(temp)
  let temp
}
```

**答案**

 **执行结果** `VM67:4 Uncaught ReferenceError: temp is not defined at <anonymous>:4:15`

 **原因** 

+ 报错的原因是因为 “暂时性死区” (temporal dead zone， TDZ)
+ 首先存在一个全局变量 `temp` ，但是块级作用域内用`let`又声明了一个局部变量`temp` ，在这个块级作用域中，因为当前作用域存在变量 `temp` ，`console.log` 就不会再往外层作用域查找，但是在 `let` 声明的变量之前访问该变量会报错。

> [ES6 标准入门 -- let](https://es6.ruanyifeng.com/?search=tdz&x=0&y=0#docs/let)

---

### 3. 结合 ES6 新语法，用最简单的方式找出数组中的最小值

```js
var arr = [12, 34, 32, 89, 4]
```

**答案**

```js
let arr = [2,3,4,5,6,7,8];
let num = (arg) => Math.min(...arg);
num(arr); //2
```

>  [Math.min() 返回零个或更多个数值的最小值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/min)

---

### 4. 请详细说明 var，let，const 三种声明变量的方式之间的具体差别？

**答案**

区别：

+ `var` 声明的变量可以在声明位置之前被访问到，且值为 `undefined` ，`let` 和 `const` 声明的变量不能在声明位置之前被访问，直接报错;
+ 对 `var` 来说，只存在 **函数作用域** 和 **全局作用域** ; 对 `let` 和 `const` 来说，还存在 **块级作用域** ，比如 `if` 语句
+ 在全局范围中，`var` 声明的变量 **会被挂载** 到全局对象上（window / global），而 `let` 和 `const` 不会
+ `var` 允许重复声明变量，`let` 和 `const` 不行，且 **`const` 声明的变量必须初始化一个值**

> [ES6 标准入门 -- let](https://es6.ruanyifeng.com/?search=tdz&x=0&y=0#docs/let) 
>
> [MDN let](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let)  [MDN var](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/var)  [MDN cosnt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/const)

---

### 5. 请说出下列代码最终输出的结果，并解释为什么？

```js
var a = 10
var obj = {
  a: 20,
  fn() {
    setTimeout(() => {
      console.log(this.a)
    })
  },
}

obj.fn()
```

**答案** `20`

**原因**

+ 箭头函数不会创建自己的`this` ,它只会从自己的作用域链的上一层继承 `this`。

+ 由上一条可得，定时器中的 `this` 绑定到了 `fn() {}` 这个函数作用域中，`fn` 最后是被 `obj` 调用，所以定时器中的 `this` 指向 `obj` 
+ 综上所述，定时器中的 `this` 指向 `obj` ，`obj.a === 20` 所以 `obj.fn()` 输出 `20` 

> [MDN 箭头函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
>
> [MDN this](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)

---

### 6. 简述 `Symbol` 类型的用途？

**答案**

用途：

+ **迭代器**，`Symbol` 实现了 `Iterator` 迭代器接口，可以被 `for... of...` 所使用
+ **常量枚举** ，利用 `Symbol()`  总是会返回独一无二的值，不用担心值的重复
+ **私有属性** ，隐藏属性，对一些方法如 `Object.keys` 来说访问不到
+ **新基本类型** ，从此 JavaScript 就有了 7 种类型

```
class RegExp1 extends RegExp {
 [Symbol.match](str) {
  var result = RegExp.prototype[Symbol.match].call(this, str);
  return result ? 'VALID' : 'INVALID';
 }
}
 
console.log('2012-07-02'.match(new RegExp1('([0-9]+)-([0-9]+)-([0-9]+)')));
// expected output: "VALID"
Symbol.toPrimitive

var count = {
  value: 3
};
count + 2   // "[object Object]2"

count[Symbol.toPrimitive] = function () {
  return this.value
};
count + 2   // 5

```

> [MDN Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)

---

### 7. 说说什么是浅拷贝，什么是深拷贝？

**答案**

> JavaScript 中数据分为基本数据类型(`String, Number, Boolean, Null, Undefined, Symbol`)和对象数据类型(`Object, Function, Array`)
>
> 基本数据类型：直接存储在 **栈(Stack)** 中的数据
>
> 引用数据类型：存储的是该对象在栈中的引用，真实的数据存放在 **堆(Heap)** 内存里

+ 深拷贝和浅拷贝是只针对 `Object` 和 `Array` 这样的引用数据类型的
+ **浅拷贝**只复制指向某个对象的**指针**，而不复制对象本身，新旧对象还是**共享**同一块内存。修改新对象会影响到原对象
+ **深拷贝** 会另外创建一个一模一样的对象，新对象和原对象**不共享**内存，修改新对象不会影响到原对象

> 常见的**浅拷贝**：`Object.assign` ，`Array` 的一些实例方法如 `concat, slice` 不会修改原数组，但会返回一个浅拷贝了原数组中的元素的一个新数组
>
> 常见的**深拷贝**：`JSON.parse(JSON.stringify)` 这种方法不能处理例如函数，function，正则的复制; `lodash` 库中的 `deepClone` 方法

---

### 8. 谈谈你是如何理解 JS 异步编程的，Event Loop 是做什么的，什么是宏任务，什么是微任务？

**答案**

**异步编程**

​	由于 JavaScript 的执行环境是 **单线程** ，一次只能完成一件任务。如果有多个任务，就必须排队，等前一个任务完成，再执行后面一个任务。

​	这种模式虽然实现起来比较简单，执行环境相对单纯，但是只要有一个任务耗时很长，后面的任务都必须排队等着，会拖延整个程序的执行。常见的浏览器无响应（假死），往往就是因为某一段 Javascript 代码长时间运行（比如死循环），导致整个页面卡在这个地方，其他任务无法执行。

​	为了解决这个问题，Javascript 将任务的执行模式分成两种：同步和异步。

**Event Loop**

​	`Event Loop`即事件循环，是指浏览器或`Node`的一种解决`javaScript`单线程运行时不会阻塞的一种机制，也就是我们经常使用**异步**的原理。

<img src="https://tva1.sinaimg.cn/large/007S8ZIlly1gev6mdtd59j30g909x3yy.jpg" alt="Event Loop" style="zoom:67%;" />

**宏任务** (Macrotask)

> 可以理解是每次执行栈执行的代码就是一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行栈中执行

|                         | Browser | Node |
| -------- | :-----: | :----: |
| `I/O`                   |   yes   | yes  |
| `setTimeout`            |   yes   | yes  |
| `setInterval`           |   yes   | yes  |
| `setImmediate`          |   no    | yes  |
| `requestAnimationFrame` |   yes   |  no  |

**微任务** (Microtask)

> microtask,可以理解是在当前 task 执行结束后立即执行的任务。也就是说，在当前task任务后，下一个task之前，在渲染之前

|                                | Browser | Node |
| -------- | :----: | :----: |
|       `process.nextTick`       |   no    | yes  |
|       `MutationObserver`       |   yes   |  no  |
| `Promise.then .catch .finally` |   yes   | yes  |



---

### 9. 将下列异步代码使用 Promsie 改进？

```js
setTimeout(function () {
  var a = 'hello'
  setTimeout(function () {
    var b = 'lagou'
    setTimeout(function () {
      var c = 'I 💕️ U'
      console.log(a + b + c)
    }, 10)
  }, 10)
}, 10)
```

**答案**

```js
function run(...args) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([...args])
    }, 10)
  })
}

run('hello')
  .then(value => run(...value, 'lagou'))
  .then(value => run(...value, 'I 💕️ U'))
  .then(value => console.log(value.join(' ')))

```



---

### 10. 请简述 TypeScript 与 JavaScript 之间的关系？

**答案**

​	TypeScript 是 JavaScript 的超集，TS 包括了 JS、类型系统 和 ES6+

​	TS 可以通过编译转为 JS，且任何一种 JS 运行环境都支持

​	TS 相对于 JS 功能更为强大，生态也更健全、更完善

---

### 11. 请谈谈你所认为的 TypeScript 优缺点？

**答案**

+ 优点
  + TS 包括了 jS、类型系统 和 ES6+，特别是类型系统，让代码更加健壮，更容易维护
  + TS 相对于 JS 功能更为强大，生态也更健全、更完善
  + TypeScript 增加了代码的可读性和可维护性
  + TS 属于 **渐进式** ，有利于上手且不会对项目造成破坏性修改

+ 缺点
  + 有一定的学习成本，需要理解接口（Interfaces）、泛型（Generics）、类（Classes）、枚举类型 +  + （Enums）等前端工程师可能不是很熟悉的概念
  + 短期可能会增加一些开发成本，毕竟要多写一些类型的定义，不过对于一个需要长期维护的项目，TypeScript 能够减少其维护成本
  + 集成到构建流程需要一些工作量
  + 可能和一些库结合的不是很完美


