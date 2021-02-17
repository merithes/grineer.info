<template>
  <ApolloQuery
  :query='gql => gql `
  query{
    tags (where: {slug: "${$route.params.tagSlug}"}, limit: 1) {
      id
      name
      thumbnail { url width }
      banner { url }
      description
      hex_color
      news_articles (sort: "created_at:desc") {
        id
        created_at
        updated_at
        title
        body
        excerpt
        published_at
        slug
        thumbnail { url width }
        tags (sort: "order") { name id slug hex_color }
      }
    }
    }`'
    notifyOnNetworkStatusChange
  >
    <template v-slot="{ result: { loading, error, data } }">
      <div class="row justify-center">
        <template
          v-if="!loading || isTagLoaded(data)"
          v-for="tag in (!loading && isTagLoaded(data) ? data.tags : [])"
        >
          <showBanner :banner="tag.banner" :no-margin="typeof tag.thumbnail !== 'undefined' && tag.thumbnail !== null && typeof tag.thumbnail.url === 'string' && tag.thumbnail.url.length"/>
          <div
            v-if="typeof tag.thumbnail !== 'undefined' && tag.thumbnail !== null && typeof tag.thumbnail.url === 'string' && tag.thumbnail.url.length"
            class="col-md-12 text-center relative-position"
            :class="{
              'col-xs-4': $q.screen.width <= 400,
              'col-xs-3': $q.screen.width > 400
            }"
          >
            <div style="width:256px;max-width: 100%;" class="inline-block drop-shadow-5">
              <div style="padding-bottom:50%"></div>
              <q-img
                :src="$strapiURL + tag.thumbnail.url"
                width="256px"
                style="max-width: 100%;"
                class="absolute-bottom"
              >
                  <template v-slot:loading>
                    <div class="full-height full-width row justify-center items-center">
                      <q-spinner-rings color="accent" size="80%"/>
                    </div>
                  </template>
              </q-img>
            </div>
          </div>
          <div
            v-if="typeof tag.name === 'string' && tag.name.length"
            class="col-xs-10"
            :class="{
              'q-mb-md': typeof tag.description !== 'string' || !tag.description.length,
              'q-mt-lg': tag.banner === null
            }"
          >
            <span
              class="text-h3 courier-prime inline-block block-underline small-line q-pb-xs"
              :class="{
                'full-width text-center q-mb-sm': isMobile,
                'q-pr-md q-mb-md': !isMobile
              }"
            >
              {{tag.name}}
            </span>
          </div>
          <div
            v-if="tag.description !== null"
            class="col-xs-10 q-mb-md"
          >
            <q-markdown
              :src="tag.description.split('/uploads/').join($strapiURL+'/uploads/')"
              no-heading-anchor-links
            />
          </div>
        </template>
        <template
          v-else
        >
          <div class="col-xs-10">

          </div>
        </template>
        <div class="col-xs-10">
          <listArticles
          v-if="loading || (isTagLoaded(data) && Array.isArray(data.tags[0].news_articles))"
          :loading="loading"
          :news-articles="loading ? null : data.tags[0].news_articles"
          :excerpt-length="600"
          />
        </div>
      </div>
    </template>
  </ApolloQuery>
</template>

<script>
  import listArticles from 'components/articles/listArticles.vue'
  import showBanner from 'components/widget/showBanner.vue'
  export default {
    name: 'PageIndex',
    components: { listArticles, showBanner },
    data () {
      return {
        updateInterval: 5
      }
    },
    computed: {
      isMobile() {
        return (this.$q.screen.width <= 1023)
      }
    },
    methods: {
      isTagLoaded(data) {
        return typeof data !== 'undefined' && Array.isArray(data.tags) && typeof data.tags[0] === 'object'
      }
    }
  }
</script>
