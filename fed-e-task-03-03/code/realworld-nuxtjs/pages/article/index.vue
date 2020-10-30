<template>
  <div class="article-page">

    <div class="banner">
      <div class="container">

        <h1>{{ article.title }}</h1>

        <article-meta :article="article"/>

      </div>
    </div>

    <div class="container page">

      <div class="row article-content">
        <div class="col-md-12" v-html="article.body"></div>
      </div>

      <hr />

      <div class="article-actions">
        <article-meta :article="article"/>
      </div>

      <div class="row" v-if="user">

        <div class="col-xs-12 col-md-8 offset-md-2">
          <article-comments :article="article" />
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import MarkdownIt from 'markdown-it'
import { getArticle } from '@/api/article';
import ArticleMeta from './components/article-mate'
import ArticleComments from './components/article-comments'
import { mapState } from "vuex"
export default {
  name: 'Article',
  head() {
    // 设置页面 meta 以优化 SEO
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.article.description
        }
      ]
    }
  },
  components: { ArticleMeta, ArticleComments },
  async asyncData({ params }) {
    const { data } = await getArticle(params.slug)
    const { article } = data

    const md = new MarkdownIt()
    article.body = md.render(article.body)

    return {
      article: article
    }
  },
  data () {
    return {}
  },
  created() {
    this.article.changingFavorite = false
    this.article.author.changingFollow = false
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {}
}
</script>

<style>
</style>
