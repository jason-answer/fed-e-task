<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? 'Sign in' : 'Sign up' }}</h1>
          <p class="text-xs-center">
            <nuxt-link to="/register" v-if="isLogin">Need an account?</nuxt-link>
            <nuxt-link to="/login" v-else>Have an account?</nuxt-link>
          </p>
          
          <ul class="error-messages">
            <template v-for="(msgs, field) in errors ">
              <li v-for="(msg, index) in msgs" :key="index">{{ field }} {{ msg }}</li>
            </template>            
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset class="form-group" v-if="!isLogin">
              <input 
                class="form-control form-control-lg" 
                type="text" 
                placeholder="Your Name"
                required
                v-model="user.username">
            </fieldset>
            <fieldset class="form-group">
              <input 
                class="form-control form-control-lg" 
                type="email" 
                placeholder="Email" 
                required
                v-model="user.email">
            </fieldset>
            <fieldset class="form-group">
              <input 
                class="form-control form-control-lg" 
                type="password"
                placeholder="Password" 
                required
                minlength="8"
                v-model="user.password">
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? 'Sign in' : 'Sign up' }}
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from '@/api/user'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  middleware: 'notAuthenticated',
  name: 'LoginIndex',
  components: {},
  data () {
    return {
      errors: {},

      user: {
        username: '',
        email: '',
        password: ''
      }
    }
  },
  computed: {
    isLogin() {
      return this.$route.name === 'login'
    }
  },
  methods: {
    async onSubmit() {
      try {
        const { data } = this.isLogin 
          ? await login({
            user: this.user
          })
          : await register({
            user: this.user
          })

        // 存储到容器，以便客户端数据共享
        this.$store.commit('setUser', data.user)

        // 为防止刷新页面后数据丢失，需要把数据持久化
        Cookie.set('user', data.user)

        this.$router.push('/')

      } catch (error) {
        console.dir(error)
        this.errors = error.response.data.errors
      }
    }
  }
}
</script>

<style>
</style>
