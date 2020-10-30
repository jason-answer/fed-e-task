<template>
  <div>
    <form class="card comment-form" @submit.prevent="onCommitComment">
      <div class="card-block">
        <textarea 
          class="form-control" 
          placeholder="Write a comment..." 
          rows="3"
          v-model="comment"
        ></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary" :disabled="submitting">
        Post Comment
        </button>
      </div>
    </form>
    
    <div class="card" v-for="comment in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">{{ comment.body }}.</p>
      </div>
      <div class="card-footer">
        <nuxt-link class="comment-author" :to="{
          name: 'profile',
          params: {
            username: comment.author.username
          }
        }">
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>        
        &nbsp;
        <nuxt-link class="comment-author" :to="{
          name: 'profile',
          params: {
            username: comment.author.username
          }
        }">
          {{ comment.author.username }}
        </nuxt-link>  
        <a href="" class="comment-author">Jacob Schmidt</a>
        <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticleComments, commitArticleComment } from '@/api/article';
import { mapState } from 'vuex'
export default {
  name: 'ArticleComments',
  components: {},
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      comments: [],
      comment: '',
      submitting: false
    }
  },
  async mounted() {
    const { data } = await getArticleComments(this.article.slug)
    this.comments = data.comments
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async onCommitComment() {
      try {
        this.submitting = true
        const { data } = await commitArticleComment(this.article.slug, {
          comment: {
            body: this.comment
          }
        })
        this.comments.unshift(data.comment)
        this.submitting = false
      } catch (error) {
        console.dir(error)
        this.submitting = false
      }
    }
  }
}
</script>

<style>
</style>
