<template>
  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">

        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="user">
                <nuxt-link 
                  class="nav-link"
                  :class="{active: tab === 'your_feed'}"
                  exact
                  :to="{
                    name: 'home',
                    query: { tab: 'your_feed' }
                  }"
                >Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link"
                  :class="{active: tab === 'global_feed'}"
                  exact
                  :to="{ name: 'home' }"
                >Global Feed</nuxt-link>
              </li>
              <li class="nav-item" v-if="tag">
                <nuxt-link 
                  class="nav-link"
                  :class="{active: tab === tag}"
                  exact
                  :to="{
                    name: 'home',
                    query: { tab: 'tag_feed', tag, }
                  }"
                >#{{ tag }}</nuxt-link>
              </li>
            </ul>
          </div>

          <div 
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link :to="`/profile/${article.author.username}`">
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link class="author" :to="`/profile/${article.author.username}`">
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button 
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{ active: article.favorited }"
                :disabled="article.changingFavorite"
                @click="onFavorite(article)"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link class="preview-link" :to="`/article/${article.slug}`">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
          <!-- 分页 -->
          <nav>
            <ul class="pagination">
              <li 
                class="page-item"
                v-for="item in totalPage"
                :key="item"
                :class="{active: item === page}"
              > 
                <nuxt-link 
                  class="page-link" 
                  :to="{
                    name: 'home', 
                    query: {
                      page: item,
                      tag: $route.query.tag,
                      tab
                    }
                  }"
                >{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link 
                class="tag-pill tag-default"
                v-for="tag in tags"
                :key="tag"
                :to="{
                  name: 'home',
                  query: { tag, tab: 'tag_feed' }
                }"
              >{{ tag }}</nuxt-link>
            </div>
          </div>
        </div>

        

      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getArticles, getFeedArticles, addFavorite, deleteFavorite } from '@/api/article'
import { getTags } from '@/api/tag'

export default {
  name: 'HomeIndex',
  components: {},
  async asyncData ({ query }) {
    const page = Number(query.page || 1)
    const limit = 20
    const tab = query.tab || 'global_feed'
    const tag = query.tag
    const loadArticles = (tab === 'global_feed' || tab === 'tag_feed')
      ? getArticles 
      : getFeedArticles

    const [ articleRes, tagRes ] = await Promise.all([
      loadArticles({
        limit: limit,
        offset: (page - 1)*limit,
        tag,
      }),
      getTags()
    ])
    const { articles, articlesCount } = articleRes.data
    const { tags } = tagRes.data

    articles.forEach(article => article.changingFavorite = false)
    return {
      articles,
      articlesCount,      
      tags,
      limit,
      page,
      tab, // 选项卡
      tag, // 标签
    } 
  },
  data () {
    return {}
  },
  watchQuery: ['page', 'tag', 'tab'],
  computed: {
    ...mapState(['user']),

    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  methods: {
    async onFavorite (article) {
      article.changingFavorite = true

      if (article.favorited) {
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount -= 1
      } else {
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      
      article.changingFavorite = false
    }
  }
}
</script>

<style>
</style>

