<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>{{ profile.bio }}</p>

            <nuxt-link 
              v-if="isUser"
              class="btn btn-sm btn-outline-secondary action-btn"  
              to="/settings"
            >
              <i class="ion-gear-a"></i> Edit Profile Settings
            </nuxt-link>
            <button 
              v-else
              class="btn btn-sm btn-outline-secondary action-btn"
              :class="{active: profile.following}"
              :disabled="profile.changingFollow"
              @click="onFollow(profile)"
            >
              <i class="ion-plus-round"></i> 
              {{ !profile.following ? 'Follow' : 'Unfollow' }}
              {{ profile.username }}
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <!-- 选项卡 -->
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link"
                  :class="{active: tab === 'my_articles'}"
                  exact
                  :to="{
                    path: `/profile/${profile.username}`,
                    query: { tab: 'my_articles' }
                  }"
                >My Articles</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link"
                  :class="{active: tab === 'favorited_articles'}"
                  exact
                  :to="{
                    path: `/profile/${profile.username}`,
                    query: { tab: 'favorited_articles' }
                  }"
                >Favorited Articles</nuxt-link>
              </li>
            </ul>
          </div>
          <!-- 文章列表 -->
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
                    path: `/profile/${profile.username}`,
                    query: {
                      page: item,
                      tab
                    }
                  }"
                >{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserProfile, followUser, unfollowUser } from '@/api/user';
import { getArticles, addFavorite, deleteFavorite } from '@/api/article'

export default {
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: 'authenticated', // 多个中间件中数组
  name: 'Profile',
  components: {},
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    
  },
  async asyncData({ params, query, store }) {
    const { data } = await getUserProfile(params.username)
    const { profile } = data
    profile.changingFollow = false

    let isUser = false
    if (params.username === store.state.user.username) {
      isUser = true
    }

    const tab = query.tab || 'my_articles'
    const page = Number(query.page || 1)
    const limit = 20

    // 获取文章列表
    const getArticlesParams = tab === 'favorited_articles' 
      ? { favorited: params.username, author: undefined  }
      : { favorited: undefined, author: params.username  }
    const articleRes = await getArticles({
      ...getArticlesParams,
      limit: limit,
      offset: (page - 1)*limit,
    })
    const { articles, articlesCount } = articleRes.data
    articles.forEach(article => article.changingFavorite = false)

    return {
      profile: profile,
      isUser,
      tab, // 选项卡
      articles,
      articlesCount,
      limit,
      page
    }
  },
  data () {
    return {}
  },
  watchQuery: ['page', 'tab'],
  mounted() { },
  computed: {
    ...mapState(['user']),
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  methods: {
    async onFollow (profile) {
      profile.changingFollow = true
      if (profile.following) {
        await unfollowUser(profile.username)
        profile.following = false
      } else {
        await followUser(profile.username)
        profile.following = true
      }
      
      profile.changingFollow = false
    },
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
