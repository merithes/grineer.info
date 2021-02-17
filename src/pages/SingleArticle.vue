<template>
  <ApolloQuery
    :query='gql => gql `
    query{
      newsArticles (where: { slug: \"${$route.params.articleSlug}\" }, limit: 1){
        id
        created_at
        updated_at
        title
        body
        excerpt
        published_at
        thumbnail { url }
        banner { url }
        author { name }
        category { name slug hasArchive }
        tags (sort: "order") { name slug id hex_color }
      }
    }`'
    notifyOnNetworkStatusChange
  >
    <!-- The result will automatically updated -->
    <template v-slot="{ result: { loading, error, data } }">
    <!-- Some content -->
    <div
      v-if="loading"
    >
      <div class="row">
        Waiting
      </div>
      </div>
      <div
        v-else-if="Array.isArray(data.newsArticles) && data.newsArticles.length && data.newsArticles[0]"
        class="row justify-center"
        v-for="Article in data.newsArticles"
        :key="Article.id"
      >

      <!-- BLOCK BANNER -->

      <template v-if="typeof Article.banner !== 'undefined' && Article.banner !== null">
        <showBanner :banner="Article.banner"/>
      </template>

      <!-- BLOCK HEAD -->

        <div
          class="col-xs-12 q-mb-md"
          :class="{
            'q-mt-xl': typeof Article.banner === 'undefined' || Article.banner === null
          }"
        >

          <!-- BREADCRUMB -->

          <div
            v-if="$q.screen.width >= 600"
            class="row justify-center"
          >
            <div class="col-sm-9 col-xs-10 col-md-9 col-lg-8 q-mb-md courier-prime text-subtitle1">
              <div class="inline-block bg-med-dark-overlay q-px-sm q-pb-xs">
                <router-link class="text-white inline-block" to="/">Homepage</router-link>
                <q-icon name="chevron_right" class="q-mx-sm"/>
                <router-link
                  v-if="typeof Article.category !== 'undefined' && Article.category !== null && Article.category.slug !== null && Article.category.slug.length && Article.category.hasArchive !== null"
                  class="text-white inline-block"
                  :to="`/category/${Article.category.slug}`"
                >
                  {{Article.category.name}}
                </router-link>
                <span
                  v-else-if="typeof Article.category !== 'undefined' && Article.category !== null  && Article.category.hasArchive === null"
                  class="text-white inline-block text-subtitle1"
                >
                  {{Article.category.name}}
                </span>
                <q-icon name="chevron_right" class="q-mx-sm" v-if="typeof Article.category !== 'undefined' && Article.category !== null"/>
                <span
                  class="text-white inline-block text-subtitle1"
                >
                  {{Article.title}}
                </span>
              </div>
            </div>
          </div>
          <div class="row justify-center">
            <div
              class="col-sm-2 col-md-1 col-lg-1 relative-position"
              :class="{
                'col-xs-3': $q.screen.width >= 400,
                'col-xs-5': $q.screen.width < 400
              }"
            >

              <!-- HEAD IMG -->

              <q-img
                :src="
                typeof Article.thumbnail !== 'undefined' && Article.thumbnail !== null && typeof Article.thumbnail.url === 'string' && Article.thumbnail.url.length ?
                  $strapiURL + Article.thumbnail.url :
                  'images/GRINEER_RED.svg'
                "
                ratio="1"
                position="center center"
                class="inline-block border-gray overflow-hidden"
                :img-style="{
                  filter: 'drop-shadow(0 0 8px rgba(0,0,0,.5))'
                }"
                :class="{
                  'top-overflow-50': $q.screen.width < 600 && typeof Article.banner !== 'undefined' && Article.banner !== null,
                  'bg-grey-10': $q.screen.width < 600,
                  'bg-med-dark-overlay': $q.screen.width >= 600
                }"
              >
                <template v-slot:loading>
                  <div class="full-height full-width row justify-center items-center">
                    <q-spinner-rings color="accent" size="80%"/>
                  </div>
                </template>
              </q-img>
            </div>



            <div
              class="col-sm-7 col-md-8 col-xs-10 col-lg-7"
              :class="{
                'q-pl-md': $q.screen.width >= 600
              }"
            >
                <h1
                  class="block-underline courier-prime inline-block small-line q-mt-none q-mb-md q-pb-sm"
                  :class="{
                    'text-h6': $q.screen.width <= 991,
                    'text-h4': $q.screen.width > 991,
                    'q-pr-md': $q.screen.width >= 600,
                    'text-center': $q.screen.width < 600,
                    'full-width': $q.screen.width < 600,
                    'q-mt-md': $q.screen.width < 600
                  }"
                >
                  {{ Article.title }}
                </h1>
                <div class="row q-mb-sm">
                  <div class="col-xs-12 q-gutter-xs"
                    v-if="Array.isArray(Article.tags) && Article.tags.filter(element => typeof element.slug !== 'undefined').length"
                  >
                    <span>Tags:</span>
                    <template
                      v-for="tag in Article.tags"
                      v-if="tag !== null && typeof tag.slug !== 'undefined'"
                    >
                      <router-link :to="'/tag/'+tag.slug">
                        <q-badge
                          v-if="typeof tag.name === 'string' && tag.name.length"
                          :key="tag.id"
                          class="no-border-radius courier-prime q-pt-xs q-px-xs"
                        >
                          [{{tag.name}}]
                        </q-badge>
                      </router-link>
                    </template>
                  </div>
                  <div
                    v-if="typeof Article.category !== 'undefined' && Article.category !== null && Article.category.slug !== null && Article.category.slug.length"
                    class="col-md-12 q-mt-sm"
                  >
                    <span class="inline-block inconsolata">Category:&nbsp;</span>
                    <router-link
                      v-if="Article.category.hasArchive !== null"
                      class="text-white inline-block"
                      :to="`/category/${Article.category.slug}`"
                    >
                      {{ Article.category.name }}
                    </router-link>
                    <span
                      v-else
                      class="text-white inline-block"
                    >
                      {{ Article.category.name }}
                    </span>
                  </div>
                </div>
                <div class="row">
                  <div
                    class="courier-prime"
                    :class="{
                      'col-sm-12 col-xs-6': $q.screen.width > 410,
                      'col-xs-12': $q.screen.width <= 410,
                    }"
                  >
                    {{ Article.published_at }}
                  </div>
                  <div
                    v-if="typeof Article.author === 'object' && Article.author !== null && typeof Article.author.name !== 'undefined' && Article.author.name.length"
                    :class="{
                      'col-sm-12 col-xs-6': $q.screen.width > 410,
                      'text-right': $q.screen.width < 600 && $q.screen.width > 410,
                      'col-xs-12': $q.screen.width <= 410,
                    }"
                  >
                    <q-icon name="img:images/GRINEER_WHITE.svg" /> {{ Article.author.name }}
                  </div>
                </div>
            </div>
          </div>
        </div>

        <!-- BLOCK BODY -->

        <div
          v-if="typeof Article.body === 'string' && Article.body.length"
          class="col-xs-10 col-md-9 col-sm-9 col-lg-8"
        >
          <q-markdown
            :src="Article.body.split('/uploads/').join($strapiURL+'/uploads/')"
            no-heading-anchor-links
          />
        </div>
      </div>
    </template>
  </ApolloQuery>
</template>

<script>
  import showBanner from 'components/widget/showBanner.vue'
  export default {
    name: 'PageIndex',
    components: { showBanner },
    data () {
      return {
      }
    },
    computed: {
    },
    methods: {
    }
  }
</script>
