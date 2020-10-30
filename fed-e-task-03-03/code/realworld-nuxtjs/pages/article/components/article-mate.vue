<template>
  <div class="article-meta">
    <nuxt-link :to="{
      name: 'profile',
      params: {
        username: article.author.username
      }
    }">
      <img :src="article.author.image" />
    </nuxt-link>
    
    <div class="info">
      <nuxt-link :to="{
        name: 'profile',
        params: {
          username: article.author.username
        }
      }">
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
    </div>

    <template v-if="isAutor">
      <nuxt-link 
        class="btn btn-outline-secondary btn-sm" 
        :to="{
          name: 'editor',
          params: {
            slug: article.slug
          }
        }"
      ><i class="ion-edit"></i> Edit Article</nuxt-link>

      <button 
        class="btn btn-outline-danger btn-sm" 
        :disabled="deleteing"
        @click="onDeleteArticle(article)"
      >
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
    <template v-else>
      <button 
        class="btn btn-sm btn-outline-secondary"
        :class="{active: article.author.following}"
        :disabled="article.author.changingFollow"
        @click="onFollow(article)"
      >
        <i class="ion-plus-round"></i>
          {{ !article.author.following ? 'Follow' : 'Unfollow' }}
          {{ article.author.username }}
      </button>
      &nbsp;&nbsp;
      <button 
        class="btn btn-sm btn-outline-primary"
        :class="{active: article.favorited}"
        :disabled="article.changingFavorite"
        @click="onFavorite(article)"
      >
        <i class="ion-heart"></i>
        &nbsp;
        Favorite Post <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
  </div>
</template>

<script>
import { addFavorite, deleteFavorite, deleteArticle } from '@/api/article'
import { followUser, unfollowUser } from '@/api/user'
import { mapState } from 'vuex'
export default {
  name: 'ArticleMeta',
  components: {},
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isAutor: false,
      deleteing: false
    }
  },
  mounted() {
    if (this.user.username === this.article.author.username) [
      this.isAutor = true
    ]
  },
  computed: {
    ...mapState(['user'])
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
    },

    async onFollow (article) {
      const { author } = article
      author.changingFollow = true
      if (author.following) {
        await unfollowUser(author.username)
        author.following = false
      } else {
        await followUser(author.username)
        author.following = true
      }
      
      author.changingFollow = false
    },

    async onDeleteArticle(article) {
      try {
        this.deleteing = true
        const res = await deleteArticle(article.slug)

        this.deleteing = false
        this.$router.push({ name: 'home' })
      } catch (error) {
        console.dir(error)
        this.deleteing = false
      }      
    }
  }
}
</script>

<style>
</style>
