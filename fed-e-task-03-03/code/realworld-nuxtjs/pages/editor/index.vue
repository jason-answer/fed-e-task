<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent="onPublishArticle">
            <fieldset>
              <fieldset class="form-group">
                <input 
                  type="text" 
                  class="form-control form-control-lg" 
                  placeholder="Article Title"
                  v-model="title"
                >
              </fieldset>
              <fieldset class="form-group">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="What's this article about?"
                  v-model="description"
                >
              </fieldset>
              <fieldset class="form-group">
                <textarea 
                  class="form-control" 
                  rows="8" 
                  placeholder="Write your article (in markdown)"
                  v-model="body"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Enter tags"
                  v-model="tagStr"
                >
                <div class="tag-list">
                  <span 
                    class="tag-pill tag-default"
                    v-for="(tag, index) in tagList"
                    :key="index"
                  >{{ tag }}</span>
                </div>
              </fieldset>
              <button 
                class="btn btn-lg pull-xs-right btn-primary"
                :disabled="publishing"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { getArticle, createArticle, updateArticle } from '@/api/article';

export default {
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: 'authenticated', // 多个中间件中数组
  name: 'Editor',
  components: {},
  async asyncData({ params }) {
    if (params.slug) {
      const { data } = await getArticle(params.slug)
      const { article } = data
      return { article: article }
    } else {
      return { article: {} }
    }
  },
  data () {
    return {
      title: '',
      description: '',
      body: '',
      tagStr: '',
      // tagList: []

      publishing: false
    }
  },
  computed: {
    tagList: function () {
      return this.tagStr.split(' ').filter(tag => tag.length > 0)
    }
  },
  mounted() {
    if (this.article.slug) {
      this.title = this.article.title,
      this.description = this.article.description,
      this.body = this.article.body,
      this.tagStr = this.article.tagList.toString()
      // this.tagList = this.article.tagList
    }
  },
  methods: {
    async onPublishArticle() {
      this.publishing = true
      try {
        const publishFun = this.article.slug
          ? updateArticle
          : createArticle
        const { data } = await publishFun({
          article: {
            title: this.title,
            description: this.description,
            body: this.body,
            tagList: this.tagList,
          }
        }, this.article.slug)
        
        this.publishing = false
        this.$router.push({name: 'article', params: {slug: data.article.slug}})
      } catch (error) {
        console.dir(error)
        this.publishing = false
      }
    }
  }
}
</script>

<style>
</style>
