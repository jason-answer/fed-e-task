/**
 * 在服务器渲染期间运行的都是同一个实例
 * 为防止数据冲突，需把 state 定义成一个函数返回数据对象
 */
export const state = () => {
  return {
    // 登录用户信息
    user: null
  }
}

export const mutations = {
  setUser (state, user) {
    state.user = user
  }
}

const cookieparser = process.server ? require('cookieparser') : undefined
export const actions = {
  /**
   * 初始化容器以及需要传递给客户端的数据
   * 
   * nuxtServerInit 是个特殊的 action，只会在服务端渲染期间运行
   * @param {*} commit 提交 mutations 的方法
   * @param {*} req 服务端的请求对象
   */
  nuxtServerInit ({ commit }, { req }) {
    let user = null
    // 若请求头中有 Cookie （这是服务端代码）
    if (req && req.headers && req.headers.cookie) {
      // cookieparser 把 cookie 字符串内容解析成 JS 对象
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
      } catch (err) {
        // No valid cookie found
      }
    }
    commit('setUser', user)
  }
}