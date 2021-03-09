<template>
  <div id="commentSpace">

      <ApolloQuery
        ref="commentQuery"
        :query="qryGetComments"
        :variables="{ articleId }"
        notifyOnNetworkStatusChange
        v-on:result="saveData"
      >
        <template v-slot="{ result: { loading, error, data } }">
          <q-list
            v-if="!loading || (loading && commentsList.length)"
          >
          <!-- <pre>{{ commentsList }}</pre> -->
            <q-item
              v-for="(comment, index) of commentsList"
              :key="index"
              bordered
              class="border-bottom comment-border"
              :class="{
                'q-mt-xs': index > 0
              }"
            >
              <q-item-section top>
                <q-item-label
                  v-if="typeof comment.author !== 'undefined' && typeof comment.author === 'object' && comment.author !== null && typeof comment.author.username === 'string' && comment.author.username.length"
                  caption
                >
                  {{ comment.author.username }}
                </q-item-label>
                <q-item-label>
                  {{ comment.content }}
                </q-item-label>
              </q-item-section/>
            </q-item>
          </q-list>
          <div v-else>
            loading...
          </div>
        </template>
      </ApolloQuery>
      <q-expansion-item
        v-if="$store.state.session.expiry > Math.floor(Date.now() / 1000)"
        icon="comment"
        label="Submit a comment"
        class="q-mt-md"
        header-class="bg-thin-bright-overlay"
      >
        <q-form class="q-mt-md" @submit="sendComment()">
          <q-input v-model="commentInput" type="textarea" label="Type in your comment" filled square class="textarea-no-resize"/>
          <div class="flex flex-center q-mt-md">
            <q-btn type="submit" label="Send" class="no-border-radius" color="primary" :loading="loadingSubmit" :disabled="commentInput.trim().length < 10">
              <q-tooltip v-if="commentInput.trim().length < 10">Your comment is too short.</q-tooltip>
            </q-btn>
          </div>
        </q-form>
      </q-expansion-item>
  </div>
</template>
<script>
  import { COMMENT_SUBMIT, GET_COMMENTS } from 'assets/constants/queries.js'
  export default {
    name: "commentSpace",
    data: () => ({
      commentInput: '',
      loadingSubmit: false,
      qryGetComments: GET_COMMENTS,
      commentsList: []
    }),
    props: ['articleId'],
    methods: {
      saveData(result) {
        if (typeof result === 'object' && typeof result.data === 'object' && result.data !== null && Array.isArray(result.data.comments)) {
          this.commentsList = result.data.comments
        }
      },
      refreshComments() {
        this.$refs.commentQuery.getApolloQuery().refetch()
      },
      sendComment() {
        this.loadingSubmit = true
        let commentInput = this.commentInput
        let articleId = this.articleId
        this.$apollo.mutate({
          mutation: COMMENT_SUBMIT,
          variables: {
            commentInput,
            articleId
          }
        }).then((result) => {
          this.commentInput = ''
          this.$q.notify({
            type: 'positive',
            message: 'Comment submitted!'
          })
          this.refreshComments()
        }).catch((error) => {
          this.$q.notify({
            type: 'negative',
            message: 'There was an issue submitting your comment.'
          })
        }).finally(() => {
          this.loadingSubmit = false
        })
      }
    }
  }
</script>
