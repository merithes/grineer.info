<template>
  <div id="UserProfile">
    <ApolloQuery
      :query="qryGetUser"
      :variables="{ userId }"
      class="row justify-center q-mt-xl"
      notifyOnNetworkStatusChange
    >
      <template v-slot="{ result: { loading, error, data } }">
        <div class="col-sm-9 col-xs-10 col-md-9 col-lg-8 q-mb-md">
          <div class="row q-col-gutter-lg">
            <div class="col-sm-2">
              <div class="full-width bg-med-dark-overlay q-pa-md grineer-primary-border-faded">
                <div class="force-square full-width">
                  <template v-if="loading">
                    <q-skeleton size="100%" class="bg-light-bright-overlay" square/>
                  </template>
                  <template v-else>
                    <q-img src="https://picsum.photos/400"/>
                  </template>
                </div>
              </div>
            </div>
            <div class="col-sm-10">
              <div class="full-width bg-med-dark-overlay q-pa-md grineer-primary-border-faded">
                <div class="row q-col-gutter-lg">
                  <div class="col-xs-12">
                    <span class="inline-block block-underline q-pb-xs q-pr-md text-h5 courier-prime">
                      <template v-if="loading">
                        <q-skeleton type="text" width="8ch" class="bg-light-bright-overlay" square/>
                      </template>
                      <template v-else>
                        {{ typeof data.user.description !== 'undefined' && data.user.description !== null && data.user.description.trim().length ? data.user.description : data.user.username }}
                      </template>
                    </span>
                  </div>
                  <div class="col-xs-12 col-sm-8">
                    <template v-if="loading">
                      <q-skeleton type="text" width="100%" class="bg-light-bright-overlay"/>
                      <q-skeleton type="text" width="85%" class="bg-light-bright-overlay"/>
                      <q-skeleton type="text" width="90%" class="bg-light-bright-overlay"/>
                      <q-skeleton type="text" width="60%" class="bg-light-bright-overlay"/>
                    </template>
                    <template v-else>
                      {{ typeof data.user.displayName !== 'undefined' && data.user.displayName !== null && data.user.displayName.trim().length ? data.user.displayName : "No description yet" }}
                    </template>
                  </div>
                  <div class="col-xs-12 col-sm-4">
                    <div class="q-gutter-md">
                      <div
                        v-if="loading"
                        class=""
                      >

                      </div>
                      <div
                        v-else
                        v-for="(comment, index) of data.user.comments"
                        :key="index"
                        class="comment-border row q-pl-md"
                      >
                        <div
                          class="col-xs-12 text-caption text-grey-7 q-mb-xs"
                        >
                          {{ isoTime(comment.created_at) }}
                          <q-icon v-if="isTimeDiffEnough(comment.updated_at, comment.created_at)" name="drive_file_rename_outline">
                            <q-tooltip>
                              {{ isoTime(comment.updated_at) }}
                            </q-tooltip>
                          </q-icon>
                          on {{ comment.news_article.title }}
                        </div/>
                        <div class="col-xs-12">
                          <q-markdown
                            no-html
                            no-link
                            no-image
                            :src="comment.content ? comment.content : '&nbsp;'"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </ApolloQuery>
  </div>
</template>
<script>
  import { GET_USER } from 'assets/constants/queries.js'
  export default {
    name: "UserProfile",
    data: () => ({
      userId: '',
      qryGetUser: GET_USER,
    }),
    methods: {
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
    },
    mounted() {
      if (typeof this.$route.params.userId === 'string' && this.$route.params.userId.length) {
        this.userId = this.$route.params.userId
      } else if (this.$store.state.session.expiry * 1000 > Date.now()) {
        this.userId = this.$store.state.session.id
      } else {
        $router.go("/login")
      }
    }
  }
</script>
