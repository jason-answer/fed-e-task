# 陈刚 | Part 3 | 模块一 手写 Vue Router、手写响应式实现、虚拟 DOM 和 Diff 算法

## 一、简答题

### 1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如果把新增成员设置成响应式数据，它的内部原理是什么。

```
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})
```
不是响应式数据, Vue 无法检测 property 的添加或移除。由于 Vue 会在初始化实例时对 property 执行 getter/setter 转化，所以 property 必须在 data 对象上存在才能让 Vue 将它转换为响应式的。

```
var vm = new Vue({
  data:{
    a:1
  }
})

// `vm.a` 是响应式的

vm.b = 2
// `vm.b` 是非响应式的
```
对于已经创建的实例，Vue 不允许动态添加根级别的响应式 property。但是，可以使用 Vue.set(object, propertyName, value) 方法向嵌套对象添加响应式 property。例如，对于：
```
Vue.set(vm.someObject, 'b', 2)
```
您还可以使用 vm.$set 实例方法，这也是全局 Vue.set 方法的别名：
```
this.$set(this.someObject,'b',2)
```
有时你可能需要为已有对象赋值多个新 property，比如使用 Object.assign() 或 _.extend()。但是，这样添加到对象上的新 property 不会触发更新。在这种情况下，你应该用原对象与要混合进去的对象的 property 一起创建一个新的对象。
```
// 代替 `Object.assign(this.someObject, { a: 1, b: 2 })`
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
```

### 2、请简述 Diff 算法的执行过程。

+ 对比新旧节点的key和sel是否相同，如果不是相同节点，删除之前的内容，重新渲染
+ 如果是相同节点，判断vnode的text是否有值，比较不同，如果不同更新文本
+ Diff 算法是对新旧节点的同级进行比较
![Diff 算法](./images/diff.png "Diff 算法")

## 二、编程题

### 1、模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。
 
### Code: [01-hash-router](https://github.com/jason-answer/fed-e-task/tree/master/fed-e-task-03-01/code/01-hash-router)

### 2、在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。
 
### Code: [02-vue-directive](https://github.com/jason-answer/fed-e-task/tree/master/fed-e-task-03-01/code/02-vue-directive)

### 3、参考 Snabbdom 提供的电影列表的示例，利用Snabbdom 实现类似的效果，如图：
![Movie List](./images/movies-list.png)

### Code: [03-movie-list](https://github.com/jason-answer/fed-e-task/tree/master/fed-e-task-03-01/code/03-movie-list)