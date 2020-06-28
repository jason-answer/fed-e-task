# 陈刚 | Part 2 | 模块二 模块化开发与规范化标准

## 一、简答题

### 1、Webpack 的构建流程主要有哪些环境？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。

### webpack 构建流程环境
- none 不开启任何优化选项
- development 以开发模式打包
    - 会将 process.env.NODE_ENV 的值设为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin。
- production 以生产模式打包
    - 会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin.

### Webpack 打包过程 
- 设置打包模式(mode)
- 设置打包的入口(entry)
- 设置打包的出口(output)
- 用loader 将所有类型的文件转换为 webpack 能够处理的有效模块
- 引入打包所需要的插件

### 2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。

- 1、loader：

       loader从字面的意思理解，是 加载 的意思。

          由于webpack 本身只能打包commonjs规范的js文件，所以，针对css，图片等格式的文件没法打包，就需要引入第三方的模块进行打包。

          loader虽然是扩展了 webpack ，但是它只专注于转化文件（transform）这一个领域，完成压缩，打包，语言翻译。

          loader是运行在NodeJS中。

          仅仅只是为了打包，仅仅只是为了打包，仅仅只是为了打包，重要的话说三遍！！！

         

  如：  css-loader和style-loader模块是为了打包css的

        babel-loader和babel-core模块时为了把ES6的代码转成ES5

        url-loader和file-loader是把图片进行打包的。

- 2、plugin：

    通过 `webpack` 为我们提供的各个阶段的 `hooks`，在webpack运行的生命周期中会广播出许多事件，plugin可以监听这些事件，在合适的时机通过webpack提供的API改变输出结果。

### loader和plugin的区别

    对于loader，它是一个转换器，将A文件进行编译形成B文件，这里操作的是文件，比如将A.scss转换为A.css，单纯的文件转换过程

    plugin是一个扩展器，它丰富了webpack本身，针对是loader结束后，webpack打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听webpack打包过程中的某些节点，执行广泛的任务


## 二、编程题

### 1、使用 Webpack 实现 Vue 项目打包任务

具体任务及说明：

1. 先下载任务的基础代码：https://github.com/lagoufed/fed-e-001/raw/master/tasks/02-02-base-code.zip
2. 这是一个使用 Vue CLI 创建出来的 Vue 项目基础结构
3. 有所不同的是这里我移除掉了 vue-cli-service（包含 webpack 等工具的黑盒工具）
4. 这里的要求就是直接使用 webpack 以及你所了解的周边工具、Loader、Plugin 还原这个项目的打包任务
5. 尽可能的使用上所有你了解到的功能和特性

_注：代码见 `code/vue-app-base/`_
