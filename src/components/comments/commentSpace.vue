<template>
  <div id="commentSpace">
    <q-expansion-item
      v-if="$store.state.session.expiry > Math.floor(Date.now() / 1000)"
      icon="comment"
      label="Submit a comment"
      class="q-mb-md"
      header-class="bg-thin-bright-overlay"
    >

      <div
        v-if="previewComment"
        class="q-mt-md comment-border comment-border-preview row q-pl-md"
      >
        <div class="col-xs-12 text-caption text-grey-7">
          {{ $store.state.session.username }}
        </div/>
        <div class="col-xs-12">
          <q-markdown
            no-html
            no-link
            no-image
            :src="commentInput ? commentInput : '&nbsp;'"
          />
        </div>
      </div>
      <q-form class="q-mt-md" @submit="sendComment()">
        <q-input v-model="commentInput" type="textarea" label="Type in your comment" class="textarea-no-resize" filled square>
          <template v-slot:append>
            <div class="relative-position">
              <div class="absolute-center-right" style="width: 100px">
                <q-btn label="preview" :icon="previewComment ? 'visibility_off' : 'visibility'" color="secondary" class="no-border-radius" @click="previewComment = !previewComment" dense flat/>
              </div>
            </div>
          </template>
        </q-input>
        <div class="flex flex-center q-mt-md">
          <q-btn type="submit" label="Send" class="no-border-radius" color="primary" :loading="loadingSubmit" :disabled="commentInput.trim().length < 10">
            <q-tooltip v-if="commentInput.trim().length < 10">Your comment is too short.</q-tooltip>
          </q-btn>
        </div>
      </q-form>
    </q-expansion-item>
    <ApolloQuery
      ref="commentQuery"
      :query="qryGetComments"
      :variables="{ articleId }"
      notifyOnNetworkStatusChange
      v-on:result="saveData"
    >
      <template v-slot="{ result: { loading, error, data } }">
        <div
          v-if="!loading || (loading && commentsList.length)"
          class="column q-gutter-md"
        >
          <div
            v-for="(comment, index) of commentsList"
            :key="index"
            class="comment-border row q-pl-md"
          >
            <div
              v-if="typeof comment.author !== 'undefined' && typeof comment.author === 'object' && comment.author !== null && typeof comment.author.username === 'string' && comment.author.username.length"
              class="col-xs-12 text-caption text-grey-7 q-mb-xs"
            >
              {{ comment.author.username }} - {{ isoTime(comment.created_at) }}
              <q-icon v-if="isTimeDiffEnough(comment.updated_at, comment.created_at)" name="drive_file_rename_outline">
                <q-tooltip>
                  {{ isoTime(comment.updated_at) }}
                </q-tooltip>
              </q-icon>
            </div/>
            <div class="col-xs-12">
              <q-markdown
                no-html
                no-link
                no-image
                :src="comment.content ? comment.content : '&nbsp;'"
              />
              <q-popup-edit
                :ref="`comment_${index}`"
                v-model="comment.content"
                @before-show="setCommentInput(index)"
                @hide="editOpen = false"
                title="Edit your comment"
                :persistent="typeof comment.loading !== 'undefined' && comment.loading"
                :disable="!editOpen"
              >
                <q-input v-model="comment.commentInput" dense autofocus type="textarea" @keyup.enter.stop/>
                  <div class="flex flex-center q-gutter-md q-mt-xs">
                    <q-btn label="Cancel" @click="$refs[`comment_${index}`][0].hide()" color="accent" class="no-border-radius" padding="3px 8px" flat/>
                    <q-btn label="Save" color="primary" class="no-border-radius" padding="3px 8px"
                      @click="updateComment(index)"
                      :disabled="typeof comment.commentInput !== 'undefined' && comment.commentInput.trim().length < 10"
                      :loading="typeof comment.loading !== 'undefined' && comment.loading"
                    >
                    <q-tooltip v-if="typeof comment.commentInput !== 'undefined' && comment.commentInput.trim().length < 10">Your comment is too short.</q-tooltip>
                  </q-btn>
                </div>
              </q-popup-edit>
            </div>
            <div
              v-if="$store.state.session.expiry * 1000 > Date.now() && $store.state.session.id === comment.author.id"
              class="col-xs-12"
            >
              <q-btn color="grey-5" flat dense padding="3px 5px" class="text-transform-none text-left no-border-radius" @click="openEditor(index)">
                <q-icon name="edit" size="1em"/>
              </q-btn>
              <!-- <q-btn-dropdown
                :ref="`actions_${index}`"
                class="text-transform-none no-border-radius"
                content-class="no-border-radius q-ml-xs"
                color="grey-7"
                label="Actions"
                flat dense
              >
                <div class="q-gutter-sm">
                  <div class="">
                  </div>
                  <div class="">
                    <q-btn color="grey-5" flat dense padding="2px 5px" class="text-transform-none full-width text-left no-border-radius">
                      <div class="text-left full-width courier-prime">
                        <q-icon name="delete"/>
                        delete
                      </div>
                    </q-btn>
                  </div>
                </div>
              </q-btn-dropdown> -->
            </div>
          </div>
        </div>
        <div v-else>
          loading...
        </div>
      </template>
    </ApolloQuery>
  </div>
</template>
<script>
  import { COMMENT_SUBMIT, GET_COMMENTS, UPDATE_COMMENT } from 'assets/constants/queries.js'
  export default {
    name: "commentSpace",
    data: () => ({
      commentInput: '',
      loadingSubmit: false,
      qryGetComments: GET_COMMENTS,
      commentsList: [],
      previewComment: false,
      commentUpdateIncrement: 0,
      editOpen: false
    }),
    props: ['articleId'],
    methods: {
      openEditor(index) {
        this.editOpen = true
        this.$nextTick(this.$refs[`comment_${index}`][0].show)
      },
      isoTime(time) {
        let date = new Date(time)
        return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + (date.getDate())).slice(-2)}T` +
          `${('0' + (date.getHours())).slice(-2)}:${('0' + (date.getMinutes())).slice(-2)}:${('0' + (date.getSeconds())).slice(-2)}`
      },
      isTimeDiffEnough(isoTime_a, isoTime_b) {
        // If comment is updated within 5 minutes, then we don't need to show it has been edited
        let timeStamp_a = new Date(isoTime_a)
        let timeStamp_b = new Date(isoTime_b)
        return (timeStamp_a.getTime() - timeStamp_b.getTime()) > 1000 * 60 * 5;
      },
      saveData(result) {
        if (typeof result === 'object' && typeof result.data === 'object' && result.data !== null && Array.isArray(result.data.comments)) {
          this.commentsList = result.data.comments
        }
      },
      refreshComments() {
        this.$refs.commentQuery.getApolloQuery().refetch()
      },
      setCommentInput(index) {
        this.$set(this.commentsList[index], 'commentInput', this.commentsList[index].content)
      },
      updateComment(index) {
        this.$set(this.commentsList[index], 'loading', true)
        let comment = this.commentsList[index]
        let commentInput = comment.commentInput
        let commentId = comment.id
        this.$apollo.mutate({
          mutation: UPDATE_COMMENT,
          variables: {
            commentInput,
            commentId
          }
        }).then((result) => {
          this.commentInput = ''
          this.$q.notify({
            type: 'positive',
            message: 'Comment updated!'
          })
          this.refreshComments()
        }).catch((error) => {
          this.$q.notify({
            type: 'negative',
            message: 'There was an issue updating your comment.'
          })
        }).finally(() => {
          this.$set(this.commentsList[index], 'loading', false)
          // this.$refs[`actions_${index}`][0].hide()
          this.$refs[`comment_${index}`][0].hide()
        })
      },
      sendComment() {
        this.loadingSubmit = true
        this.previewComment = false
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
