<template>
  <div id="commentSpace">

      <ApolloQuery
        ref="commentQuery"
        :query="qryGetComments"
        :variables="{ articleId }"
        notifyOnNetworkStatusChange
      >
        <template v-slot="{ result: { loading, error, data } }">
          <div v-if="!loading">
            {{ data }}
          </div>
          <div v-else>
            loading...
          </div>
        </template>
      </ApolloQuery>
      <q-expansion-item
        icon="comment"
        label="Submit a comment"
      >
        <q-form class="q-mt-md" @submit="sendComment()">
          <q-input v-model="commentInput" type="textarea" label="Type in your comment" filled square class="textarea-no-resize"/>
          <div class="flex flex-center q-mt-md">
            <q-btn type="submit" label="Send" class="no-border-radius" color="primary" :loading="loadingSubmit"/>
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
      qryGetComments: GET_COMMENTS
    }),
    props: ['articleId'],
    methods: {
      refreshComments() {
        this.$refs.commentQuery.getApolloQuery().refetch()
      },
      sendComment() {
        this.loadingSubmit = false
        let commentInput = this.commentInput
        let articleId = this.articleId
        this.$apollo.mutate({
          mutation: COMMENT_SUBMIT,
          variables: {
            commentInput,
            articleId
          }
        }).then((result) => {
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
