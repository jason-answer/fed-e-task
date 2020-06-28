# Rollup

## 1.概述
- 将散落的细小模块打包为整块代码
- Rollup 与 Webpack 类似，但 Rollup 更为小巧
- 仅仅是一款 ESM 打包器
- 安装：yarn add rollup --dev 
- 对文件进行打包：yarn rollup ./src/index.js --format iife --file dist/bundle.js

## 2.Rollup 配置文件
- 在根部目录下创建 rollup.config.js 文件
- 运行配置文件：yarn rollup --config (配置文件)
```
export default{
    input: 'src/index.js',  //指定输入
    output: {  //指定输出
        file: 'dist/main.js', //打包后的文件
        format: 'iife'  //打包的形式
    }
}
```

## 3.Rollup 插件
- 插件是 rollup 唯一的扩展途径
- 在模块中导入 json 文件：rollup-plugin-json
- 加载 npm 模块：rollup-plugin-node-resolve
- 加载 CommonJS 模块：rollup-plugin-commonjs

## 4.Rollup 代码拆分
### 动态导入
- js文件
```
// 动态导入
import('./logger').then(({ log }) => {
    log('动态导入 logger 模块')
})
```
- rollup.config.js 文件
```
export default{
    input: 'src/index.js',  //指定输入
    output: {  //指定输出
        dir: 'dist',  //动态导入指定输出目录
        format: 'amd'  //动态导入指定打包形式
    }
}
```
- 运行配置：yarn rollup --config --format amd
    - 指定打包形式后可不加 --format amd

### 多入口打包
```
export default{
    input: ['src/index.js', 'src/album.js'],  //指定输入
    output: {  //指定输出
        dir: 'dist',  //指定输出目录
        format: 'amd'  //指定打包形式
    }
}
```

## 5.Rollup 选用原则
- 优点：
    - 输出结果更加扁平
    - 自动移除未引用代码
    - 打包结果依然完全可读

- 缺点：
    - 加载飞 ESM 的第三方模块比较复杂
    - 模块最终都被打包到一个函数中，无法实现 HMR
    - 浏览器环境中，代码拆分功能依赖 AMD 库

- 适用于开发 框架、类库

## 6.webpack 与 rollup
- webpack 大而全，rollup 小而美
- 应用程序开发使用 webpack
- 类库、框架开发使用 rollup

# Parcel
- 零配置的前端引用打包器，官方建议使用 html 文件作为打包的入口
- 安装：yarn add parcel-bundler --dev
- 打包：yarn parcel src/index.html(指定输入)
    - 自动开启一个服务
    - 提供热替换
    - 自动安装模块所需要的依赖
    - 构建速度快
- 以生产模式进行打包：yarn parcel build src/index.html