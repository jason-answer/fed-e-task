<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="onUpdateUser">
            <fieldset>
              <fieldset class="form-group">
                <input 
                  class="form-control" 
                  type="text" 
                  placeholder="URL of profile picture"
                  v-model="image"
                >
              </fieldset>
              <fieldset class="form-group">
                <input 
                  class="form-control form-control-lg" 
                  type="text" 
                  placeholder="Your Name"
                  v-model="username"
                >
              </fieldset>
              <fieldset class="form-group">
                <textarea 
                  class="form-control form-control-lg" 
                  rows="8" 
                  placeholder="Short bio about you"
                  v-model="bio"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input 
                  class="form-control form-control-lg" 
                  type="text" 
                  placeholder="Email"
                  required
                  v-model="email"
                >
              </fieldset>
              <fieldset class="form-group">
                <input 
                  class="form-control form-control-lg" 
                  type="password" 
                  placeholder="Password"
                  required
                  v-model="password"
                >
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" :disabled="submitting">
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr />
          <button class="btn btn-outline-danger" @click="onLogout">
            Or click here to logout.
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { updateUser } from '@/api/user'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: 'authenticated', // 多个中间件中数组
  name: 'Settings',
  components: {},
  data () {
    return {
      image: '',
      username: '',
      bio: '',
      email: '',
      password: '',

      submitting: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  mounted() {
    this.image = this.user.image,
    this.username = this.user.username,
    this.bio = this.user.bio,
    this.email = this.user.email
  },
  methods: {
    async onUpdateUser() {
      try {
        this.submitting = true
        const { data } = await updateUser({
          image: this.image,
          username: this.username,
          bio: this.bio,
          email: this.email,
          password: this.password
        })

        this.$store.commit('setUser', data.user)
        Cookie.set('user', data.user)
        this.$router.push({name: 'profile', params: {username: data.user.username}})
        this.submitting = false
      } catch (error) {
        console.dir(error)
        this.submitting = false
      }
    },
    onLogout() {
      this.$router.push({name: 'home'})
      
      this.$store.commit('setUser', null)
      Cookie.remove('user')
      
    }
  }
}
</script>

<style>
</style>
