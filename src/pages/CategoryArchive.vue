<template>
  <ApolloQuery
  :query='gql => gql `
  query{
    categories (where: {slug: "${$route.params.categorySlug}"}, limit: 1) {
      id
      name
      thumbnail { url width }
      banner { url }
      description
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
          v-for="category in (!loading && isTagLoaded(data) ? data.categories : [])"
        >
          <showBanner :banner="category.banner" :no-margin="typeof category.thumbnail !== 'undefined' && category.thumbnail !== null && typeof category.thumbnail.url === 'string' && category.thumbnail.url.length"/>
          <div
            v-if="typeof category.thumbnail !== 'undefined' && category.thumbnail !== null && typeof category.thumbnail.url === 'string' && category.thumbnail.url.length"
            class="col-md-12 text-center relative-position"
            :class="{
              'col-xs-4': $q.screen.width <= 400,
              'col-xs-3': $q.screen.width > 400
            }"
          >
            <div style="width:256px;max-width: 100%;" class="inline-block drop-shadow-5">
              <div style="padding-bottom:50%"></div>
              <q-img
                :src="$strapiURL + category.thumbnail.url"
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
            v-if="typeof category.name === 'string' && category.name.length"
            class="col-xs-10 col-md-9 col-lg-8"
            :class="{
              'q-mb-lg': typeof category.description !== 'string' || !category.description.length
            }"
          >
            <span
              class="text-h3 courier-prime inline-block block-underline small-line q-pb-xs"
              :class="{
                'full-width text-center q-mb-sm q-mt-md': isMobile,
                'q-pr-md q-mb-md': !isMobile
              }"
            >
              {{category.name}}
            </span>
          </div>
          <div
            v-if="typeof category.description === 'string' && category.description.length"
            class="col-xs-10 col-md-9 col-lg-8 q-mb-md"
          >
            <q-markdown
              :src="category.description.split('/uploads/').join($strapiURL+'/uploads/')"
              no-heading-anchor-links
            />
          </div>
        </template>
        <template
          v-else
        >
          <div class="col-xs-10 col-md-9 col-lg-8">
            loading
          </div>
        </template>
        <div class="col-xs-10 col-md-9 col-lg-8">
          <listArticles
          v-if="loading || (isTagLoaded(data) && Array.isArray(data.categories[0].news_articles))"
          :loading="loading"
          :news-articles="loading ? null : data.categories[0].news_articles"
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
        return typeof data !== 'undefined' && Array.isArray(data.categories) && typeof data.categories[0] === 'object'
      }
    }
  }
</script>
