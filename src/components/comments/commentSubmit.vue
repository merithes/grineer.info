<template>
  <q-expansion-item
    id="commentSubmit"
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
</template>
<script>
  import { COMMENT_SUBMIT } from 'assets/constants/queries.js'
  export default {
    name: "commentSubmit",
    data: () => ({
      commentInput: '',
      loadingSubmit: false
    }),
    methods: {
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
        }).catch((error) => {
        }).finally(() => {
          this.loadingSubmit = false
        })
      }
    }
  }
</script>
