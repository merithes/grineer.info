<template>
  <div
    v-if="loading"
  >
    <template
      v-for="index of new Array(10)"
    >

      <!-- DEBUT LIST ITEM -->

      <div
        class="full-width no-border-radius bg-light-bright-overlay row border-gray q-mb-md pointer-events-none"
        :class="{
          'q-pa-sm': !isMobile,
        }"
        :key="index"
      >

        <!-- BLOCK IMAGE -->

        <div
          class="col-lg-3 col-md-5 col-xs-12 row justify-center"
          :class="{
            'q-pa-md': !isMobile,
            'overflow-hidden': isMobile
          }"
        >
          <!-- BLOCK IMAGE INSIDE (image défaut) -->
          <q-skeleton type="rect" square class="" width="256px" height="256px"/>
        </div>

        <!-- BLOCK DETAILS -->

        <div
          class="col-lg-9 col-md-7 col-xs-12 q-pa-md relative-position q-pb-xl"
        >

          <!-- BLOCK TITRE -->

          <span
            class="inline-block small-line q-pb-xs"
            :class="{
              'full-width text-center q-mb-sm': isMobile,
              'q-pr-md q-mb-xs': !isMobile
            }"
          >
            <q-skeleton type="text" class="text-h4" square :width="(Math.random() * 4 + 6) + 'ch'"/>
          </span>

          <!-- BLOCK EXCERPT -->

          <div
            class="text-caption text-grey text-left"
          >
            <q-skeleton type="text" class="small-line text-h6" square :width="(Math.random() * 5 + 90) + '%'"/>
            <q-skeleton type="text" class="small-line text-h6" square :width="(Math.random() * 5 + 90) + '%'"/>
            <q-skeleton type="text" class="small-line text-h6" square :width="(Math.random() * 5 + 90) + '%'"/>
            <q-skeleton type="text" class="small-line text-h6" square :width="(Math.random() * 5 + 90) + '%'"/>
          </div>

          <!-- BLOCK LINK -->
          <q-skeleton class="q-mt-sm" type="rect" square width="23ch"/>

          <!-- BLOCK DATE -->

          <q-skeleton class="q-mt-sm small-line text-h6" type="text" square width="15ch"/>

          <!-- BLOCK AUTEUR -->

          <q-skeleton class="small-line text-h5" type="text" square width="30%"/>

          <!-- BLOCK TAGS -->

          <div
            class="absolute-bottom q-mx-md q-mb-sm"
          >
            <div class="row items-center">
              <q-skeleton type="rect" class="inline-block q-ml-xs" height="1.3em" square width="4ch"/>
              <q-skeleton v-for="tagPH of [1,2,3]" :key="tagPH" type="rect" class="inline-block q-ml-xs" height="1.3em" square :width="(Math.random() * 4 + 6) + 'ch'"/>
            </div>
          </div>

          <!-- FIN BLOCK -->

        </div>
      </div>
    </template>
  </div>
  <div v-else>
    <template
      v-for="newsArticle of newsArticles"
      v-if="newsArticle !== null"
    >

      <!-- DEBUT LIST ITEM -->

      <div
        class="full-width no-border-radius bg-light-bright-overlay row border-gray q-mb-md"
        :class="{
          'q-pa-sm': !isMobile,
        }"
        :key="newsArticle.id"
      >

        <!-- BLOCK IMAGE -->

        <div
          class="col-lg-3 col-md-5 col-xs-12 flex flex-center"
          :class="{
            'inset-shadow-down bg-light-dark-overlay' : isMobile && typeof (newsArticle.thumbnail) === 'object' && newsArticle.thumbnail !== null && typeof newsArticle.thumbnail.url === 'string',
            'hidden': isMobile && !(typeof (newsArticle.thumbnail) === 'object' && newsArticle.thumbnail !== null && typeof newsArticle.thumbnail.url === 'string'),
            'q-pa-sm': !isMobile,
            'overflow-hidden': isMobile
          }"
          :style="{filter: isMobile ? '' : 'drop-shadow(0 0 8px rgba(0,0,0,.5))'}"
        >

          <!-- BLOCK IMAGE INSIDE -->

          <q-img
            v-if="typeof (newsArticle.thumbnail) === 'object' && newsArticle.thumbnail !== null && typeof newsArticle.thumbnail.url === 'string'"
            img-class="tgi-zoom-in-effect z-top t-normal-ease"
            ratio="1"
            :src="$strapiURL + newsArticle.thumbnail.url"
            :style="{
              filter: !isMobile ? '' : 'drop-shadow(0 0 8px rgba(0,0,0,.5))',
              maxWidth: '256px'
            }"
          >
            <template v-slot:loading>
              <div class="full-height full-width row justify-center items-center">
                <q-spinner-rings color="accent" size="80%"/>
              </div>
            </template>
          </q-img>

          <!-- BLOCK IMAGE INSIDE (image défaut) -->

          <q-img
            v-else
            ratio="1"
            src="images/GRINEER_RED.svg"
            width="128px"
          >
            <template v-slot:loading>
              <div class="full-height full-width row justify-center items-center">
                <q-spinner-rings color="accent" size="80%"/>
              </div>
            </template>
          </q-img>
        </div>

        <!-- BLOCK DETAILS -->

        <div
          class="col-lg-9 col-md-7 col-xs-12 q-pa-md relative-position"
          :class="{
            'q-pb-xl': Array.isArray(newsArticle.tags) && newsArticle.tags.length
          }"
        >

          <!-- BLOCK TITRE -->

          <span
            class="text-h5 courier-prime inline-block block-underline small-line q-pb-xs"
            :class="{
              'full-width text-center q-mb-sm': isMobile,
              'q-pr-md q-mb-sm': !isMobile
            }"
          >
            {{newsArticle.title}}
          </span>

          <!-- BLOCK EXCERPT -->

          <div
            v-if="typeof newsArticle.excerpt === 'string' && newsArticle.excerpt.length"
            class="text-caption text-grey"
          >
            {{newsArticle.excerpt}}
          </div>

          <!-- BLOCK EXCERPT (si non défini) -->

          <div
            v-else-if="typeof newsArticle.body === 'string'"
            class="text-caption text-grey"
          >
            {{$removeMD(newsArticle.body).substr(0,excerptLength).concat(newsArticle.body.length > excerptLength ? "..." : "")}}
          </div>

          <!-- BLOCK LINK -->

          <q-btn
            :to="`/post/${newsArticle.slug}`"
            label="Read the full article"
            unelevated
            color="primary"
            class="no-border-radius courier-prime small-line q-mt-sm btn-grineer-cutout-right q-pt-xs"
            size="1em"
            padding=".2em .5em"
            no-caps
            no-wrap
          />

          <!-- BLOCK DATE -->

          <div class="text-caption text-grey courier-prime q-mt-sm">
            {{ (newsArticle.published_at) }}
          </div>

          <!-- BLOCK AUTEUR -->

          <div
            v-if="typeof newsArticle.created_by === 'object' && newsArticle.created_by !== null"
            :class="{
              'col-sm-12 col-xs-6': $q.screen.width > 410,
              'text-right': $q.screen.width < 600 && $q.screen.width > 410,
              'col-xs-12': $q.screen.width <= 410,
            }"
          >
            <q-icon name="img:images/GRINEER_WHITE.svg" /> {{ newsArticle.created_by.username !== null ? newsArticle.created_by.username : `${newsArticle.created_by.firstname} ${newsArticle.created_by.lastname}` }}
          </div>

          <!-- BLOCK TAGS -->

          <div
            v-if="Array.isArray(newsArticle.tags) && newsArticle.tags.filter(element => typeof element.slug !== 'undefined').length"
            class="absolute-bottom q-mx-md q-mb-sm"
          >
            <div class="q-gutter-xs">
              Tags:
              <template
                v-for="tag in newsArticle.tags"
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
          </div>

          <!-- FIN BLOCK -->

        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'listArticles',
  data () {
    return {
    }
  },
  props: {
    'newsArticles'  : Array,
    'loading'       : Boolean,
    'excerptLength'  : {
      type: Number,
      default: 300
    }
  },
  computed: {
    isMobile() {
      return (this.$q.screen.width <= 1023)
    }
  },
  methods: {
    convertISODate: function(dateString) {
      let date = new Date(dateString)

      let year = date.getFullYear();
      let month = date.getMonth()+1;
      let day = date.getDate();

      if (day < 10) {
        day = '0' + day;
      }
      if (month < 10) {
        month = '0' + month;
      }

      return (year+'-' + month + '-'+day);
    }
  },
  created () {
  }
}
</script>
