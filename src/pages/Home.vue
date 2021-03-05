<template>
  <q-page class="row justify-center relative-position q-pt-xl">
    <q-btn
      v-if="isMobile"
      color="accent"
      icon="keyboard_arrow_left"
      aria-label="Alerts menu"
      title="Alerts menu"
      class="fixed-top-right tgi-alert-menu no-border-radius no-shadow q-mt-sm"
      @click="drawerRight = !drawerRight"
    />
    <div class="col-md-7 col-xs-12 col-sm-10 q-px-md">
        <ApolloQuery
          :query='gql => gql `
            query{
              newsArticles (sort: "created_at:desc"){
                id
                created_at
                updated_at
                title
                body
                excerpt
                published_at
                slug
                thumbnail { url width }
                created_by { username firstname lastname }
                tags { name slug hex_color }
              }
            }`'
            notifyOnNetworkStatusChange
            :pollInterval="updateInterval * 60 * 1000"
          >
          <template v-slot="{ result: { loading, error, data } }">
            <listArticles :loading="loading" :news-articles="loading ? null : data.newsArticles"/>
          </template>
        </ApolloQuery>
    </div>
    <div
      v-if="!isMobile"
      class="col-md-4 col-lg-3"
    >
      <liveData/>
    </div>
    <q-drawer
      v-else
      v-model="drawerRight"
      class="shadow-2"
      side="right"
      content-class=""
      :no-swipe-open="true"
      :no-swipe-close="true"
      :no-swipe-backdrop="true"
    >
      <div class="relative-position q-pt-lg">
        <q-btn
          flat
          round
          dense
          class="absolute-top-left q-mt-xs q-ml-xs"
          size=".7em"
          icon="close"
          aria-label="Menu"
          @click="drawerRight = !drawerRight"
        />
        <liveData/>
      </div>
    </q-drawer>
  </q-page>
</template>

<script>
  import liveData from 'components/widget/liveData.vue'
  import listArticles from 'components/articles/listArticles.vue'

  export default {
    name: 'PageIndex',
    components: { liveData, listArticles },
    data () {
      return {
        drawerRight : false,
        updateInterval: 5
      }
    },
    computed: {
      isMobile() {
        return (this.$q.screen.width <= 1023)
      }
    },
    methods: {
    }
  }
</script>
