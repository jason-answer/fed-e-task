# Webpack 打包

## 1.模块打包工具概要
- 打包工具解决的是前端整体的模块化并不单指JavaScript模块化

## 2.webpack简单使用
- 初始化项目：yarn init --yes
- 安装Webpack、Webpack-cli：yarn add webpack webpack-cli --dev
- 查看Webpack版本：yarn webpack --version
- 打包项目：yarn webpack
    - 开发模式打包：yarn webpack --mode development
    - 最原始转态的打包：yarn webpack --mode none
    - 默认打包路径：'src/index.js' --> 'dist/main.js'
    - 自定义配置文件：在根目录下创建 webpack.config.js
    ```
    const path = require('path')
    module.exports = {
        entry: './src/main.js',  //指定输入
        output: {  //指定输出
            mode: 'development',  //设置打包模式
            filename: 'bar.js',
            path: path.join(__dirname, 'output')
        }
    }
    ```


## 3.webpack资源模块加载
- loader 是 webpack 的核心特性，借助不同的loader就可以加载任何类型的资源
- css 模块加载器：
    - 安装loader css-loader、style-loader：yarn add css-loader style-loader --dev
    - 添加配置：
    ```
    const path = require('path')
    module.exports = {
        mode: 'none',  //设置打包模式
        entry: './src/index.css',  //指定输入
        output: {  //指定输出
            filename: 'main.js',
            path: path.join(__dirname, 'dist')
        },
        module: {
            rules: [
                {
                    test: /.css$/,
                    use: [
                        'style-loader',
                        'css-loader'
                    ]
                }
            ]
        }
    }
    ```
- 文件资源加载器：file-loader
- url 加载器：url-loader
    - 小文件使用 data URLs，减少请求次数
    - 大文件单独提取存放，提高加载速度
        - 超出 10KB 文件单独提取存放
        - 小于 10KB 文件转换为 Data URLs 嵌入代码中
- es6+代码转换：yarn add babel-loader @babel/core @babel/preset-env --dev
    - webpack 只是打包工具
    - 加载器可以用来编译转换代码

## 4.webpack 常用加载器分类
- 编译转换类
    - css-loader
- 文件操作类
    - file-loader
- 代码检查类
    - eslint-loader

## 5.webpack 模块加载方式
- 遵循 ES Modules 标准的 import 声明
- 遵循 CommonJS 标准的 require 函数
- 遵循 AMD 标准的 define 函数和 require 函数
- 样式代码中的 @import 指令和 url 函数
- HTML 代码中图片标签的 src 属性

## 6.webpack 插件
- 自动清除输出目录插件：clean-webpack-plugin
- 自动生成 HTML 插件：html-webpack-plugin
- 复制文件：copy-webpack-plugin
- css模块按需加载：mini-css-extract-plugin
    - 自动提取代码中的css到一个文件中
- css代码压缩：optimize-css-assets-webpack-plugin
- js代码压缩：terser-webpack-plugin

### webpack 插件机制的工作原理
- 相较于 loader，plugin 拥有更宽广的能力范围
- plugin 通过钩子机制实现
    - 自定义插件：一个函数或者是一个包含 apply 方法的对象
    - 通过在生命周期的钩子中挂载函数实现扩展

## 7.开发体验
### webpack自动编译
- yarn webpack --watch 以监视模式运行，监视文件变化从新打包    

### 自动刷新浏览器
- browser-sync
    - 启动：yarn browser-sync dist --file "**/*"

### webpack dev server
- 提供用于开发的 HTTP server
- 集成“自动编译”、“自动刷新浏览器”等功能
- 安装：yarn add webpack-dev-server --dev
- 运行：yarn webpack-dev-server --open

## 8.Source Map
- 用于解决源代码与运行代码不一致所产生的问题
- 在压缩后的文件中添加 source map 文件路径
    - //# sourceMappingURL = xxx.min.map

### webpack 配置 Source Map
- 在配置中添加： devtool: 'source-map'
- webpack 支持12种不同方式，每种方式的效率和效果各不同
    - eval- 是否使用 eval 执行模块代码
    - cheap-source-map 是否包含行信息
    - module- 是否能够得到 loader 处理之前的源代码

## 9.webpack HMR
- 模块热替换，应用运行过程中实时替换某个模块，应用运行状态不受影响
- 提高了开发者的工作效率
- HMR 集成在 webpack-dev-server中
- 开启热替换：yarn webpack-dev-server --hot

## 10.webpack 不同环境下的配置
- 配置文件根据环境不同导出不同配置
    - 以生产模式运行：yarn webpack --env production
- 一个环境对应一个配置文件
    - 安装 webpack-merge：yarn add webpack-merge --dev，用于合并公共的配置文件
    - 运行配置文件：

## 11.webpack 内部插件
```
optimization: {  //集中配置优化方案
    sideEffects: true,  //开启代码没有副作用
    usedExports: true,  //模块只导出外部使用的成员
    concatenateModules: true,  //合并模块，尽可能将所有模块合并输出到一个函数中
    minmize: true  //开启压缩代码
},
```
- DefinePlugin
    - 为代码注入全局成员，webpack默认插件
        - production模式下，process.env.NODE_ENV
- Tree Shaking
    - 打包时去掉代码中未引用的部分（未引用代码）
    - 生产模式下自动开启
    - 不是指某个配置选项，是一组功能搭配使用后的优化效果
- sideEffects
    - 一般用于 npm 包标记是否有副作用
        - 副作用：模块执行时除了导出成员之外所作的事情
    - 确保代码没有副作用

## 12.webpack 代码分割
### 多入口打包
- 适用于多页应用程序
- 划分规则：一个页面对应一个打包入口，公共部分单独提取
```
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'none',  //设置打包模式
    entry: {
        index:'./src/index.js',
        album: './src/album.js'
    },
    output: {  //指定输出
        filename: '[name].main.js'
    },
    optimization: {  //集中配置优化方案
        splitChunks: {  //提取功能模块
            chunks: 'all'
        }
    },
    module: {
        rules: [
            {  //babel 加载器
                test: /.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {   //css 模块加载器
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({  //用于生成 index.html 
            title: 'index entry',
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({  //用于生成 album.html 
            title: 'album entry',
            template: './src/album.html',
            filename: 'album.html',
            chunks: ['album']
        }),
    ]
}
```

### 动态导入
- 需要用到某个模块时，再加载这个模块
- 动态导入的模块会被自动分包
- 按照 ES Modules 动态导入成员的方式去导入模块，webpack内部会自动处理分包和按需加载
    -例如：vue的动态路由
- 魔法注释
    - 将默认通过动态导入生成的ChunkName(序号)命名为特定名称
    - 在导入模块时添加行内注释 /* webpackChunkName: 'posts' */ ，相同的ChunkName会被打包到一起

### 输出文件名 Hash
- hash: 8
- chunkhash: 8
- contenthash: 8